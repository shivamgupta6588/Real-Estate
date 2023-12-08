import { GoogleAuthProvider } from 'firebase/auth';
import { getAuth, signInWithPopup } from 'firebase/auth';
import {app} from '../firebase';
import {useDispatch} from 'react-redux';
import { signInSuccess} from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom';

export default function Oauth() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res= await fetch('/api/auth/google',{
                method:'POST',
                
                body: JSON.stringify({
                    name:result.user.displayName,
                    email:result.user.email,
                    photo:result.user.photoURL,
                }),
                headers:{
                    'Content-Type':'application/json',
                },
            });
            const data= await res.json();
            dispatch(signInSuccess(data));
            navigate('/')
            // console.log(result);
        } catch (error) {
            console.log(error);
            // dispatch(signInFailure(error.message|| 'An error occurred'));
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleClick}
            className="bg-red-500 text-white p-2 uppercase hover:opacity-85 rounded-md cursor-pointer"
        >
            Sign in with Google
        </button>
    );
}
