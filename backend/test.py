import os
import pytest
import httpx
from fastapi import status
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_upload_image():
    with open("./files/pet1.jpg", "rb") as file:
        response = client.post(
            "/upload", files={"file": ("pet1.jpg", file, "image/jpeg")}
        )
    
    assert response.status_code == status.HTTP_200_OK
    assert "task_id" in response.json()

def test_upload_invalid_file():
    with open("test_file.txt", "rb") as file:
        response = client.post(
            "/upload", files={"file": ("test_file.txt", file, "text/plain")}
        )
    
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

@pytest.mark.parametrize("task_state", ["PENDING", "PROCESSING", "SUCCESS", "FAILURE"])
def test_get_status(mocker, task_state):
    task_id = "some-task-id"
    mock_task = mocker.Mock()
    mock_task.state = task_state
    mock_task.info = {"progress": 50}
    mock_async_result = mocker.patch("celery.result.AsyncResult")
    mock_async_result.return_value = mock_task

    response = client.get(f"/status/{task_id}")
    assert response.status_code == status.HTTP_200_OK

    if task_state == "SUCCESS":
        assert response.json()["status"] == "completed"
        assert "video_url" in response.json()
    elif task_state == "STARTED":
        assert response.json()["status"] == "processing"
        assert "progress" in response.json()
    else:
        assert response.json()["status"] == task_state

def test_static_file_serving():
    video_url = './videos/preparedvideo.mp4'
    response = client.get(video_url)

    assert response.status_code == 200
    assert response.headers["content-type"] == "video/mp4"

if __name__ == '__main__':
    pytest.main()