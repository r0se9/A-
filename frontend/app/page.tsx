"use client"
import React, { ChangeEvent, useState, useCallback, useEffect } from "react"
import Image from "next/image"
import axios from "axios"

import { Card } from "../components/ui/card";
import Carousel from './carousel'
import { DirectionAwareHover } from "../components/ui/direction-aware-hover";

export default function IndexPage() {
  const [fetching, setFetching] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [videoUrl, setVideoUrl] =  useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imagesUrls, setImageUrls]=useState<string[]>([])
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    // This cleanup function runs when the component unmounts or files change
    return () => {
      imagesUrls.forEach(url => URL.revokeObjectURL(url)); // Revoke URLs to clean up memory
    };
  }, [imagesUrls]); 

  useEffect(() => {
    setImageUrls(files.map(file => URL.createObjectURL(file)));
  }, [files]);

  const handleImageSelect = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
  }, []);

  const checkStatus = async (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://62.146.225.35:8000/status/${taskId}`
        )
        console.log("response for checkStatus: " + JSON.stringify(response))
        if(response.data.progress !== undefined){ 
          setProgress(response.data.progress);
        }
        if (response.data.status === "completed") {
          clearInterval(interval)
          setVideoUrl(response.data.video_url)
          setProgress(100)
        }
      } catch (error) {
        console.error("Error checking status:", error)
        // Handle error
        clearInterval(interval)
      }
    }, 1000)
  }

  const uploadFile = async (file: File) => {
    setFetching(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(
            "http://62.146.225.35:8000/upload",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        console.log("Uploading file");
        const taskId = response.data.task_id;
        console.log("response for uploadFile: " + JSON.stringify(response));
        checkStatus(taskId);
    } catch (error) {
        console.error("Error uploading file:", error);
        // Handle error
    } finally {
        setFetching(false);
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    console.log("File changed", filesList);
    if (filesList && filesList.length > 0) {
        const newFilesArray = Array.from(filesList);

        setFiles(prevFiles => [...prevFiles, ...newFilesArray]); // Update state to include new files
    }
  };
  useEffect(() => {
    // Generate URLs for the uploaded files
    setImageUrls(files.map(file => URL.createObjectURL(file)));

    // Automatically select the first image if none is selected
    // This ensures an image is selected initially after uploads
    if (files.length > 0 && !selectedImage) {
        setSelectedImage(URL.createObjectURL(files[files.length - 1]));
    }
  }, [files, selectedImage]);
  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(urls);

    if (files.length > 0) {
        setSelectedImage(urls[urls.length - 1]); // Always set to the last uploaded file
    }
}, [files]);

  const handleContextMenu = (
    e: React.MouseEvent<HTMLVideoElement, MouseEvent>
  ) => {
    e.preventDefault() // Prevent default context menu (right-click menu)
  }

  const handleControlsClick = (
    e: React.MouseEvent<HTMLVideoElement, MouseEvent>
  ) => {
    e.preventDefault() // Prevent clicks on the video controls (play, pause, download button)
  }

  const handleUpload = () => {
    if (files.length === 0 || fetching) return
    setVideoUrl(null)
    setProgress(0)
    const lastFile = files[files.length - 1]
    uploadFile(lastFile)
  }

  const handleMouseEnter = useCallback(() => {
    setIsAutoplay(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoplay(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <section className="py-12 container">
      <div className="max-w-full  md:pb-4 mx-auto">
      {files.length > 0 && (
        <div className="flex flex-wrap lg:px-0 sm:px-8 px-8">
          <Carousel isAutoPlay={isAutoplay} files={files} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} handleImageSelect={handleImageSelect} />
        </div>
      )}
      </div>
      </section>
      <div className="flex max-lg:flex-col gap-10">
        <div className="flex flex-col">
          <label htmlFor="image">
            {selectedImage ? (
              <div className="flex flex-col gap-5 mt-5">
                <Card className="w-full">
                  <div className="relative  flex items-center justify-center">
                    <DirectionAwareHover imageUrl={selectedImage}>
                    </DirectionAwareHover>
                  </div>
                </Card>
                {/* <Image
                  src={selectedImage}
                  alt="Selected Image"
                  height={500}
                  width={500}
                  className="rounded-xl shadow-lg cursor-pointer"
                /> */}
                {!videoUrl && progress !== 0 && (
                  <div className="flex flex-col justify-center items-center gap-5">
                    <progress
                      value={progress}
                      max="100"
                      className="w-full"
                    ></progress>
                    <p>{progress.toFixed(2)}%</p>
                  </div>
                )}
              </div>
            ) : (
              <Image
                src={"/placeholder.png"}
                alt="placeholder"
                height={500}
                width={500}
                className={"rounded-xl shadow-lg cursor-pointer"}
              />
            )}
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mb-4 hidden"
          />
          {selectedImage && (
            <button
              onClick={handleUpload}
              className="border border-gray-600 p-3 mt-5 rounded-xl px-5 hover:bg-gray-200 duration-500 hover:text-black transition-all"
            >
              Generate
            </button>
          )}
        </div>
        <div className="">
          <input
            type="file"
            id="image"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />

          {videoUrl && (
            <div className="relative px-10 max-w-5xl">
              <video
                src={videoUrl}
                onContextMenu={handleContextMenu}
                onClick={handleControlsClick}
                controls
                controlsList="nodownload"
                autoPlay
              ></video>
              <div className="flex gap-10 justify-center mt-5">
                <button
                  onClick={() => {
                    const video = document.querySelector("video")
                    if (video) video.play()
                  }}
                  className="bg-green-500 text-white p-2 rounded-md px-10"
                >
                  Play
                </button>
                <button
                  onClick={() => {
                    const video = document.querySelector("video")
                    if (video) video.pause()
                  }}
                  className="bg-red-500 text-white  p-2 rounded-md px-10"
                >
                  Pause
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}