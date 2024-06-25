from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from celery import current_task

from celery import Celery, states
import os
import time

from celery_config import celery_app

app = FastAPI()

# CORS middleware configuration to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://62.146.225.35:3000"],  # Adjust as per your frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Ensure the 'files' directory exists for file uploads
if not os.path.exists('files'):
    os.makedirs('files')

# Ensure the 'videos' directory exists for serving static files
videos_directory = os.path.join(os.getcwd(), 'videos')
if not os.path.exists(videos_directory):
    os.makedirs(videos_directory)

# Serve static files like videos
app.mount("/videos", StaticFiles(directory=videos_directory), name="videos")

# Upload endpoint to receive files and start processing
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    file_location = f"files/{file.filename}"

    with open(file_location, "wb") as file_object:
        file_object.write(file.file.read())

    task = celery_app.send_task('main.process_image', args=[file_location])

    return {"task_id": task.id}

# Celery task to process the uploaded image file
@celery_app.task(name='main.process_image')
def process_image(file_path: str):
    try:
        for i in range(30):
            time.sleep(1)  # Simulate processing time of 1 second per loop iteration
            current_task.update_state(state='STARTED', meta={'progress': (i + 1) * 100 / 30})
        
        video_file = "prepared_video.mp4"  # Path to your prepared video file
        video_path = os.path.join(videos_directory, video_file)
        return video_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to check task status
@app.get("/status/{task_id}")
def get_status(task_id: str):
    task = celery_app.AsyncResult(task_id)

    if task.state == states.SUCCESS:
        return {"status": "completed", "video_url":"http://62.146.225.35:8000/videos/preparedvideo.mp4"}
    elif task.state == states.STARTED:
        # If task is still in progress, return the progress percentage
        return {"status": "processing", "progress": task.info.get('progress', 0)}
    else:
        return {"status": task.state}
