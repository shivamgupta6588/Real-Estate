import { useState ,useEffect} from 'react';
import { app } from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';


const UpdateListing = () => {
    const [files, setFiles] = useState([]);
    const {currentUser}=useSelector(state=>state.user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params=useParams();

    
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        regularPrice: 0,
        discountedPrice: 0,
        bedrooms: 1,
        bathrooms: 1,
        furnished: false,
        parking: false,
        type: "",
        offer: false,
        imageUrls: [],
        userRef: ""
    });
    const [imageUploadError, setImageUploadError] = useState();
    const [upload, setUpload] = useState(false);

    const handleInputChange = (e) => {
        // e.preventDefault();
        const { id, value, type, checked } = e.target;
        if(id==='sale'||id==='rent')
        {
            setFormData({
                ...formData,
                type:id
            })
        }    
        if(id==='furnished'||id==='parking'||id==='offer')
        {
            setFormData({
                ...formData,
                [id]:checked
            })
        }    
        if(type==='text'||type==='number'||type==='textarea')
        {
            setFormData({
                ...formData,
                [id]:value
            })
        }  

    };
    console.log(formData);

    const handleImage = (e) => {
        // e.preventDefault();
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUpload(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }

            Promise.all(promises)
                .then((urls) => {
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                    setImageUploadError(false);
                    setUpload(false);
                })
                .catch((err) => {
                    setImageUploadError('Image Upload Failed (3mb max size per image)')
                    setUpload(false);
                });
                
        } else {
            setImageUploadError('You can only upload 6 images');
            setUpload(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);

            const filename = new Date().getTime() + file.name;
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Calculate the upload progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    // Handle successful upload
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleDeleteImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleSubmit= async (e)=>{
        e.preventDefault();
        // const params=useParams();
        try {
            if(formData.imageUrls.length<1) return setError('You must upload atleast one image');
            if(formData.regularPrice < formData.discountedPrice) return setError('Discounted price must be less then the regular price');
            setLoading(true);
            setError(false);
            const UpdateId=params.id;
            const res = await fetch(`/api/listing/update/${UpdateId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef:currentUser._id,
                }),
              });

            const data = await res.json();
            console.log(data);
            if (data.success === false) {
            setError("failed");
            setLoading(false);
             return;
              }
          
              setError(false);
              setLoading(false);
            //   navigate(`/listing/${data._id}`);
            
        } catch (err){
            setError(err.message);
        }
        console.log(error);
    }

    useEffect(() => {
        const Listing=async()=>{
            const listID=params.id;
         const res =await fetch(`/api/listing/get/${listID}`);
         const data= await res.json();
         if(data.success===false)
         {
         console.log(data.message);
             return;
         }
         setFormData(data);
        };
 
        Listing();
     },[params.id])
     
 

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type="text"
                        maxLength="62"
                        minLength="10"
                        className='border p-3 rounded-lg'
                        id="name"
                        placeholder="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <textarea
                        id="description"
                        maxLength="62"
                        minLength="10"
                        className='border p-3 rounded-lg'
                        placeholder="description"
                        required
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        maxLength="62"
                        minLength="10"
                        id="address"
                        className='border p-3 rounded-lg'
                        placeholder="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                    />

                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id="furnished"
                                className='w-5'
                                checked={formData.furnished}
                                onChange={handleInputChange}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type='checkbox'
                                id="parking"
                                className='w-5'
                                checked={formData.parking}
                                onChange={handleInputChange}
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type='checkbox'
                                id="sale"
                                className='w-5'
                                checked={formData.type === "sale"}
                                onChange={handleInputChange}
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type='checkbox'
                                id="rent"
                                className='w-5'
                                checked={formData.type === "rent"}
                                onChange={handleInputChange}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type='checkbox'
                                id="offer"
                                className='w-5'
                                checked={formData.offer}
                                onChange={handleInputChange}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input
                                type="number"
                                className="p-3 border border-gray-300 rounded-lg"
                                required
                                min="1"
                                max="10"
                                id="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleInputChange}
                            />
                            <span>Beds</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type="number"
                                className="p-3 border border-gray-300 rounded-lg"
                                required
                                min="1"
                                max="10"
                                id="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleInputChange}
                            />
                            <span>Baths</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input
                                type="number"
                                className="p-3 border border-gray-300 rounded-lg"
                                required
                                min="1"
                                max="10000000"
                                id="regularPrice"
                                value={formData.regularPrice}
                                onChange={handleInputChange}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>(₹ / month)</span>
                            </div>
                        </div>
                        {formData.offer && <div className='flex items-center gap-2'>
                            <input
                                type="number"
                                className="p-3 border border-gray-300 rounded-lg"
                                required
                                min="0"
                                max="10000000"
                                id="discountedPrice"
                                value={formData.discountedPrice}
                                onChange={handleInputChange}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price</p>
                                <span className='text-xs'>(₹ / month)</span>
                            </div>
                        </div>}
                        
                    </div>
                </div>
                <div className='flex flex-col gap-4 flex-1 '>
                    <div>
                        <p className='font-semibold'>
                            Images:
                            <span className='text-grapy-600 font-normal ml-2'>
                                The first image will be cover (max 6)
                            </span>
                        </p>
                    </div>
                    <div className='flex gap-4'>
                        <input
                            className="border p-3 w-full border-gray-300 rounded"
                            onChange={(e) => setFiles(e.target.files)}
                            type='file'
                            multiple
                            id='images'
                            accept='image/*'
                        />
                        <button type="button" onClick={handleImage} className='border uppercase disabled:opacity-80 hover:shadow-lg border-green-600 text-green-500 rounded-sm p-2 '>
                            {upload ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    <p className='text-red-700'>
                        {imageUploadError && imageUploadError}</p>
                        <p className='text-red-700'>
                        {error && error}</p>
                    {formData.imageUrls.length > 0 && formData.imageUrls.map((urls, index) =>
                        <div className="flex items-center justify-between p-3 border rounded-lg border-gray-300" key={urls}>
                            <img src={urls} className="h-20 w-20 object-contain rounded-lg  " alt="image" />
                            <button type="button" onClick={() => { handleDeleteImage(index) }} className='text-red-500 cursor-pointer font-semibold p-3 rounded-lg hover:text-red-800 disabled:opacity-80'>
                                DELETE
                            </button>
                        </div>
                    )}
                    <button
                        disabled={loading||upload}
                        type="submit"
                        className="p-3 bg-slate-700 text-white rounded-lg uppercase"
                    >
                        {loading?'Uploading':'Update Listing'}
                    </button>
                </div>
            </form>
        </main>
    );
};

export default UpdateListing;