import cv2
import os

def blur_faces(input_video, output_video):
  # Load the video file
  cap = cv2.VideoCapture(input_video)

  # Create face and eye detectors
  face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
  eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

  # Set up the output video writer
  fourcc = cv2.VideoWriter_fourcc(*'mp4v')
  out = cv2.VideoWriter(output_video, fourcc, 30.0, (int(cap.get(3)), int(cap.get(4))))

  # Set up a loop to process the video frame by frame
  while True:
    # Read the next frame
    ret, frame = cap.read()
    if not ret:
      break

    # Convert the frame to grayscale for face and eye detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces and eyes in the frame
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    eyes = eye_cascade.detectMultiScale(gray, 1.3, 5)

    # Blur the faces and eyes
    for (x,y,w,h) in faces:
      cv2.GaussianBlur(frame[y:y+h, x:x+w], (121, 121), 0, frame[y:y+h, x:x+w])
      cv2.GaussianBlur(frame[y:y+h, x:x+w], (121, 121), 0, frame[y:y+h, x:x+w])
      cv2.GaussianBlur(frame[y:y+h, x:x+w], (121, 121), 0, frame[y:y+h, x:x+w])
    for (x,y,w,h) in eyes:
      cv2.GaussianBlur(frame[y:y+h, x:x+w], (61, 61), 0, frame[y:y+h, x:x+w])
      cv2.GaussianBlur(frame[y:y+h, x:x+w], (61, 61), 0, frame[y:y+h, x:x+w])
      cv2.GaussianBlur(frame[y:y+h, x:x+w], (61, 61), 0, frame[y:y+h, x:x+w])

    # Write the frame to the output video
    out.write(frame)

  # Release the video capture and destroy all windows
  cap.release()
  out.release()
  cv2.destroyAllWindows()

# Create the "Blured Faces" folder if it doesn't exist
if not os.path.exists('Blured Faces'):
  os.makedirs('Blured Faces')

# Process all the video files in the current directory
for file in os.listdir():
  if file.endswith('.mp4'):
    blur_faces(file, 'Blured Faces/' + file)

print("Done!")

