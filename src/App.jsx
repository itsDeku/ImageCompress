import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { getDisplaySize, getAspectRatio, readFileAsBuffer } from './js/util'

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [percentCompleted, setpercentCompleted] = useState(0)
  const [InitialResponse, setInitialResponse] = useState({})
  const [fileUri, setFileUri] = useState("");
  const [defaultFile, setdefaultFile] = useState({})
  const [ResWidth, setResWidth] = useState(0)
  const [ResHeight, setResHeight] = useState(null)
  const [ResAspect, setResAspect] = useState(null)
  const [StandardAspect, setStandardAspect] = useState("0:0")
  const [containerWidth, setContainerWidth] = useState(null);
  const [containerHeight, setContainerHeight] = useState(null);
  
  // DASHBOARD DATA 
  const [compPer, setCompPer] = useState('100')
  
  const [dColorSpace, setdColorSpace] = useState('')
  const [dFileType, setdFileType] = useState('')
  
  // after compress
  const [compressedFile, setCompressedFile] = useState("")

  const ComputeImg = () => {
    console.log(defaultFile)
    console.log(dColorSpace, dFileType, compPer, containerWidth, containerHeight)
    console.log(InitialResponse.session_id)

    const JSONdata = {
      "compressPercentage": compPer,
      "width": containerWidth,
      "fileType": dFileType,
      "colorSpace": dColorSpace,
      "sessionID": InitialResponse.session_id
    }
    axios.post('http://localhost:5000/v/compress_image', JSONdata, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log("response ", response.data)
        setCompressedFile(response.data)
      })
      .catch(error => {
        // Handle error
        console.error('Error uploading file:', error);
      });

  }

  useEffect(() => {
    if (ResWidth && ResHeight) {
      if (ResWidth / ResHeight > ResAspect) {
        const newWidth = ResHeight * ResAspect;
        setContainerWidth(Math.round(newWidth));
        setContainerHeight(Math.round(ResHeight));
      } else {
        const newHeight = ResWidth / ResAspect;
        setContainerWidth(Math.round(ResWidth));
        setContainerHeight(Math.round(newHeight));
      }
    }
  }, [ResWidth, ResHeight])




  const handleUpload = (e) => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile);

    axios.post('http://localhost:5000/v/upload_image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Progress: ${progress}%`);
        setpercentCompleted(progress);
      }
    })
      .then(response => {
        document.querySelector(".imgUpload").classList.add("hidden")
        document.querySelector(".imgUploaded").classList.remove("hidden")
        setpercentCompleted(0)
        console.log('Upload complete');
        console.log(response.data)
        setInitialResponse(response.data)
        setdefaultFile(response.data.imageData.original)
        setCompressedFile(response.data.imageData.Result)
        setResHeight(response.data.imageData.original.height)
        console.log("hello",response.data.imageData.original.height)
        setResWidth(response.data.imageData.original.width)
        setResAspect(response.data.imageData.original.width / response.data.imageData.original.height)
        setStandardAspect(getAspectRatio(response.data.imageData.original.width, response.data.imageData.original.height))
      })
      .catch(error => {
        // Handle error
        console.error('Error uploading file:', error);
      });
  };
  const BacktoUpload = () => {
    document.querySelector(".imgUploaded").classList.add("hidden")
    document.querySelector(".imgUpload").classList.remove("hidden")
  }
  const dragUpload = () => {
    // DRAG AND DROP
    const inputElement = document.querySelector(".drop-zone__input")
    const dropZoneElement = inputElement.closest(".drop-zone");
    dropZoneElement.addEventListener("click", (e) => {
      inputElement.click();
      console.log("hello")
    });
    inputElement.addEventListener("change", (e) => {
      if (inputElement.files.length) {
        setSelectedFile(inputElement.files[0])
        console.log(inputElement.files[0])
        readFileAsBuffer(inputElement.files[0]).then((result) => {
          setFileUri(result)
        })
        setFileUri(readFileAsBuffer(inputElement.files[0]))
        setFileSize(Math.floor(inputElement.files[0].size))
      }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZoneElement.classList.add("drop-zone--over");
    });
    ["dragleave", "dragend"].forEach((type) => {
      dropZoneElement.addEventListener(type, (e) => {
        dropZoneElement.classList.remove("drop-zone--over");
      });
    });
    dropZoneElement.addEventListener("drop", (e) => {
      e.preventDefault();

      if (e.dataTransfer.files.length) {
        inputElement.files = e.dataTransfer.files;
      }
      dropZoneElement.classList.remove("drop-zone--over");
    });
  }


  document.documentElement.classList.add('js');
  useEffect(() => {
    let range = document.getElementById("myRange")
    range.value = "100"
    dragUpload()
  }, [])


  function addInputEventListener(val) {
    console.log(val)
    let newVal = `${val + '%'}`
    console.log(newVal);
    document.getElementById("sliderprog").style.width = newVal
    setCompPer(val)
  }
  return (
    <>
      <header className="nav w-[100%] h-[130px]  border-lightblue flex lg:px-[10%] md:px-[12%] text-dark">
        <div className="navTools flex  text-lg font-medium text-black place-content-between w-80">
          <div className="tools text-center flex">
            <img src="fluent-dots.svg" width='20px' height="20px" alt="" srcSet="" className='my-auto  mr-1' />
            <button href="" className=' my-auto '>Tools</button>
          </div>
          <div className="prices flex">
            <button href="" className='my-auto'>Princing</button>
          </div>
          <div className="guideCenter flex">
            <button href="" className='my-auto'>Guide Center</button>
          </div>
        </div>
        <div className="Brand mx-auto flex ">
          <div className='text-4xl text-black my-auto font-black tracking-tight'>COMP.IO</div>
        </div>
        <div className="authBox flex w-[14.5rem] place-content-between font-medium">
          <div className="login flex ">
            <button className='text-lg my-auto w-28 h-12 duration-150 text-black  hover:text-light hover:bg-black rounded-full'>Login</button>
          </div>
          <div className="signin flex">
            <button className='ml-2 text-lg my-auto w-28 h-12 duration-150 text-light rounded-full  bg-black hover:bg-white hover:text-black'>Signup</button>
          </div>
        </div>
      </header>
      <main className='flex w-[100%]'>
        <div className="dashboard h-[calc(100vh-130px)] w-[50%] lg:pl-[10%] px-[7%] text-black">
          <h2 className='text-xl font-medium mt-0'>&lt; Compression Options</h2>
          <div className="compressionBox  px-[5%] py-[3%]  mt-3 border-2 border-opacity-10 rounded-xl border-black w-full">
            <span className='text-lg'>Compression</span>
            <span className='[float:right] text-2xl'>{compPer}%</span>
            <input type="range" min="1" max="100" className="slider  mt-5 " id="myRange" onChange={(e) => { addInputEventListener(e.target.value) }}></input>
            <div className="slid w-[calc(100%)] bg-light relative bottom-3 -z-10 rounded-full">
            <div id="sliderprog" className='sliderprog  w-[100%] h-[5px] bg-lightblue rounded-full'>
            </div>
            </div>
            <div className='block w-full h-full'><button className="Advance block settings  text-base mt-2 opacity-50">+ Advance Settings</button>
            </div>
          </div>
          <div className='flex'>
            <div className="ResolutionBox px-[5%] py-[3%] mt-5 border-2 border-opacity-10 rounded-xl border-black w-[50%] ">
              <span className='text-lg'>Resolution</span>
              <div className='flex mt-5'>
                <div className='Width border-2 border-[rgba(19,30,52,0.25)]'><input type="number" name="" id="" value={containerWidth} onChange={(e) => setResWidth(e.target.value)} className='w-14 p-1 leading-3' /><span className='bg-light leading-4 border-l-2 p-1 border-[rgba(19,30,52,0.25)]' >W</span></div>
                <div className='ml-5 Height border-2 border-[rgba(19,30,52,0.25)]'><input type="number" name="" id="" value={containerHeight} onChange={(e) => setResHeight(e.target.value)} className='w-14 p-1 leading-3' /><span className='bg-light leading-4 border-l-2 p-1 border-[rgba(19,30,52,0.25)]' >H</span></div>
                <span className='ml-5 mt-1 text-lg'>{StandardAspect}</span>
              </div>
            </div>

            <div className="FileTypeBox px-[5%] py-[3%] mt-5 border-2 border-opacity-10 rounded-xl border-black w-[45%] ml-[5%]">
              <label htmlFor="filetype" className='block   text-lg font-normal text-gray-900 dark:text-white'>FileType</label>
              <select name="FileType " id="resolution" onChange={e => setdFileType(e.target.value)} className='bg-white w-[100%] text-black opacity-75 focus:outline-none  mt-5 p-1 focus:ring-0 focus:border-gray-200'>
                {/* <option value={defaultFile.originalMetadata && defaultFile.originalMetadata.format}>{defaultFile.originalMetadata? defaultFile.originalMetadata.format:"Sect"}</option> */}
                <option value="">Select</option>
                <option value="webp">webp</option>
                <option value="png">png</option>
                <option value="jpeg">jpeg</option>
              </select>
            </div>
          </div>
          <div className="ColorspaceBox px-[5%] py-[3%] mt-5 border-2 border-opacity-10 rounded-xl border-black w-[30%] ">
            <label htmlFor="colorspace" className='block   text-lg font-normal text-gray-900 dark:text-white'>Colorspace</label>
            <select name="colorspace " id="resolution" onChange={e => setdColorSpace(e.target.value)} className='bg-white w-[100%] text-black opacity-75 focus:outline-none  mt-5 p-1 focus:ring-0 focus:border-gray-200'>
              <option value="">Select</option>
              <option value="grey16">GreyScale</option>
              <option value="cmyk">CMYK</option>
              <option value="srgb">Rgb</option>
            </select>
          </div>

          <div className="EstimationBox mt-16 text-black">
            <div className="estimatedSize "><span className='text-lg' >Estimated<br /> Reduced Size</span><span className='text-4xl leading-4 [float:right] '>{getDisplaySize(defaultFile.size - compressedFile.size,0)}</span></div>
            {/* <div className="estimateReduce [clear:both]"><span className='opacity-50'>Almost 87MB reduced</span><span className='[float:right] opacity-50 line-through'>152.89MB</span></div> */}
          </div>
          <button className='compute w-[100%] h-20 bg-black mt-5 text-light text-xl rounded-full' onClick={() => ComputeImg()}>Compress File</button>
        </div>



        <div className="imgPreview h-[calc(100vh-130px)] lg:pr-[10%] w-[50%] pr-[7%] ">
          {/* {BEFORE UPLOAD} */}
          <div className="imgUpload flex  h-[95%] w-[100%]  border-2 border-black border-opacity-50 rounded-3xl bg-light ">
            <div className="m-auto w-[80%] h-[70%]">
              <div className="uploadBox relative drop-zone flex w-full h-[60%] border-dashed border-black rounded-2xl bg-white border-2">
                <span className="drop-zone__prompt absolute w-full flex h-full"><span className='m-auto'>Drop file here or click to upload</span></span>
                <input type="file" name="myFile" className="absolute hidden drop-zone__input " />
              </div>
              {/* <input type="file" className='block m-auto' name="" id="" /> */}
              <div className="uploadinfo  mt-12">
                <div className='w-full h-full'><span className='font-medium '>{selectedFile ? selectedFile.name : "hello"}</span><span className='[float:right] font-normal text-sm leading-6 opacity-60'>{percentCompleted}%</span></div>
                <div className="progressBar [clear:both] mt-1 rounded-full relative w-full h-2">
                  <div className="progressBarBack absolute rounded-full w-full h-full bg-dark"></div>
                  <div className="ProgressBarfore absolute rounded-l-full z-20 h-full duration-150 bg-blue" style={{ width: percentCompleted + "%" }}></div>
                </div>
                <div className='h-5 w-full mt-2'><span className='[float:right] text-sm font-normal opacity-60'>{getDisplaySize(Math.floor((percentCompleted / 100) * fileSize))}/{getDisplaySize(fileSize)}</span></div>
                <button type="button" className='block [float:right] w-36 h-12 mt-5 rounded-lg bg-black text-light' onClick={e => { handleUpload(e) }}>Upload</button>
              </div>
            </div>
          </div>
          {/* AFTER UPLOAD */}
          <div className="imgUploaded hidden flex w-full h-[95%] bg-black rounded-3xl" style={{ background: `linear-gradient(0deg, hsl(calc(${!InitialResponse.palettes ? '0' : InitialResponse.palettes.Muted[1]}),100%,95%) 50%, hsl(calc(${!InitialResponse.palettes ? '0' : InitialResponse.palettes.Vibrant[1]}),100%,95%) 70%)` }}>
            <div className='m-auto h-[90%] w-[90%]'>
              <div className='absolute ml-[calc(50%-16%)] z-10 block'>
                <button className='mt-2  w-7 h-7 ' onClick={BacktoUpload}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={`hsl(calc(${!InitialResponse.palettes ? '0' : InitialResponse.palettes.Muted[1]}),100%,95%)`} xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_30_17)">
                      <path d="M20.4799 3.512C19.3666 2.39623 18.0438 1.51142 16.5875 0.908375C15.1312 0.305335 13.5701 -0.00404852 11.9939 -0.00200409C5.36592 -0.00200409 -0.00708008 5.371 -0.00708008 11.999C-0.00708008 15.313 1.33692 18.314 3.50892 20.486C4.62225 21.6018 5.94505 22.4866 7.40134 23.0896C8.85763 23.6927 10.4187 24.002 11.9949 24C18.6229 24 23.9959 18.627 23.9959 11.999C23.9959 8.685 22.6519 5.684 20.4799 3.512ZM18.9379 18.939C18.0271 19.8521 16.9449 20.5762 15.7534 21.0698C14.5619 21.5634 13.2846 21.8166 11.9949 21.815C6.57192 21.815 2.17592 17.419 2.17592 11.996C2.1743 10.7063 2.42755 9.42902 2.92111 8.23751C3.41467 7.04601 4.13881 5.96377 5.05192 5.053C5.96248 4.13987 7.04453 3.41571 8.23588 2.92215C9.42723 2.42858 10.7044 2.17535 11.9939 2.177C17.4159 2.177 21.8119 6.573 21.8119 11.995C21.8136 13.2845 21.5604 14.5617 21.0668 15.7531C20.5733 16.9444 19.8491 18.0265 18.9359 18.937L18.9379 18.939Z" />
                      <path d="M13.5371 12L17.3921 8.14499C17.5822 7.93772 17.685 7.66501 17.6789 7.38379C17.6728 7.10257 17.5583 6.83457 17.3593 6.63574C17.1604 6.4369 16.8923 6.3226 16.6111 6.31668C16.3298 6.31077 16.0572 6.4137 15.8501 6.60399L15.8511 6.60299L11.9961 10.458L8.14105 6.60299C7.93378 6.41283 7.66107 6.31008 7.37985 6.31617C7.09863 6.32227 6.83063 6.43675 6.6318 6.63572C6.43296 6.83468 6.31866 7.10275 6.31274 7.38398C6.30683 7.6652 6.40976 7.93784 6.60005 8.14499L6.59905 8.14399L10.4541 11.999L6.59905 15.854C6.49059 15.9535 6.40339 16.0739 6.34269 16.208C6.28199 16.3421 6.24905 16.4871 6.24586 16.6343C6.24267 16.7814 6.26929 16.9277 6.32412 17.0643C6.37895 17.2009 6.46085 17.325 6.5649 17.4291C6.66895 17.5332 6.79299 17.6152 6.92956 17.6701C7.06612 17.7251 7.21239 17.7518 7.35955 17.7487C7.50671 17.7456 7.65172 17.7127 7.78586 17.6521C7.91999 17.5915 8.04048 17.5044 8.14005 17.396L8.14105 17.395L11.9961 13.54L15.8511 17.395C15.9506 17.5035 16.071 17.5907 16.2051 17.6514C16.3392 17.7121 16.4842 17.745 16.6313 17.7482C16.7785 17.7514 16.9248 17.7248 17.0614 17.6699C17.198 17.6151 17.3221 17.5332 17.4262 17.4291C17.5303 17.3251 17.6123 17.2011 17.6672 17.0645C17.7221 16.9279 17.7488 16.7817 17.7457 16.6345C17.7426 16.4873 17.7098 16.3423 17.6492 16.2082C17.5886 16.0741 17.5015 15.9536 17.3931 15.854L17.3921 15.853L13.5371 12Z" />
                    </g>
                    <defs>
                      <clipPath id="clip0_30_17">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
              <div id="image-comparison-slider" className='image-container overflow-hidden rounded-3xl w-full h-[60%]'>
                {<ReactCompareSlider
                  itemOne={<ReactCompareSliderImage src={fileUri} srcSet={fileUri} alt="Image one" />}
                  itemTwo={<ReactCompareSliderImage src={compressedFile.ResultImage ? compressedFile.ResultImage : compressedFile} srcSet={compressedFile.ResultImage ? compressedFile.ResultImage : compressedFile} alt="Image two" />}
                />}
              </div>
              <div className='w-full mt-7' style={{ color: `${!InitialResponse.palettes ? '0' : InitialResponse.palettes.Muted[0]}` }} ><span className='font-medium ' >Source Image</span><span className='[float:right] font-medium '>Compressed Image</span></div>
              <div className='w-full mt-1 h-4 [clear:both]' style={{ color: `${!InitialResponse.palettes ? '0' : InitialResponse.palettes.Muted[0]}` }}><span className='font-normal text-xs relative bottom-1 leading-1 opacity-60'>Size: {getDisplaySize(defaultFile.size)}</span><span className='[float:right] font-normal text-xs  opacity-60'>Estimated Size: {getDisplaySize(compressedFile.size)}</span></div>
              <div className='w-full mt-1 h-4 [clear:both]' style={{ color: `${!InitialResponse.palettes ? '0' : InitialResponse.palettes.Muted[0]}` }}><span className='font-normal text-xs relative bottom-1 leading-1 opacity-60'>FileType: {defaultFile.format}</span><span className='[float:right] font-normal text-xs  opacity-60'>FileType:{compressedFile.format}</span></div>
              <div className='w-full mt-1 h-4 [clear:both]' style={{ color: `${!InitialResponse.palettes ? '0' : InitialResponse.palettes.Muted[0]}` }}><span className='font-normal text-xs relative bottom-1 leading-1 opacity-60'>ColorSpace: {defaultFile.space}</span><span className='[float:right] font-normal text-xs  opacity-60'>ColorSpace:{compressedFile.space}</span></div>

              <button className='block download mx-auto w-[80%] h-16 rounded-full mt-14 text-xl bg-black text-light' style={{ background: `${!InitialResponse.palettes ? '0' : InitialResponse.palettes.Muted[0]}`, color: `white` }}>Download</button>

            </div>
          </div>
        </div>
      </main >
    </>
  );
}

export default App;
