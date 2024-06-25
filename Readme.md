# Dockerized Next.js and FastAPI Application with Celery

This project showcases a Dockerized setup for a modern web application using Next.js for the frontend, FastAPI for the backend, and Celery for handling asynchronous tasks. The application's core functionality allows users to upload images, which are processed in the background to generate a video.

## Application Overview

### Frontend (Next.js)

The frontend, powered by Next.js, provides a user-friendly interface for uploading and managing images. Key features include:

- **Image Upload**: Users can select and upload multiple images.
- **Image Carousel**: Uploaded images are displayed in a carousel, facilitating easy navigation and selection.
- **Upload Progress**: During image processing, a progress bar indicates the status of each image's conversion process.
- **Video Playback**: Once processing is complete, users can view and interact with the generated video.

### Backend (FastAPI)

The backend, built with FastAPI, serves as the processing engine for uploaded images. It includes:

- **File Upload Endpoint**: Accepts image uploads and stores them locally.
- **Task Management**: Utilizes Celery for asynchronous task processing, ensuring smooth handling of image-to-video conversion tasks.
- **Static File Serving**: Provides access to generated videos via a static file server.

### Celery Integration

Celery plays a crucial role in managing background tasks, ensuring responsiveness and scalability. It orchestrates the following processes:

- **Task Dispatch**: Initiates image processing tasks upon receiving an image upload request.
- **Progress Tracking**: Updates task progress in real-time, enabling the frontend to display accurate progress indicators.
- **Completion Notification**: Once processing concludes, Celery notifies the backend, which then provides users with access to the generated video.

## Setup and Deployment

### Prerequisites

Ensure you have Docker and Docker Compose installed on your system.

### Getting Started

1. **Clone the Repository**:

   ```sh
   git clone <repository_url>
   cd my_project
   ```

````
2. Run the project
   ```sh
   docker compose up --build
````
