import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';

type Props = {
   videoUrl: string,
   title: string
}

const CoursePlayer: FC<Props> = ({ title, videoUrl }) => {
   const [videoData, setVideoData] = useState({
      otp: "",
      playbackInfo: ""
   });
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      setIsLoading(true);
      setError(null);

      axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/getVdoCipherOTP`, {
         videoId: videoUrl,
      }).then((res) => {
         setVideoData(res.data);
         setIsLoading(false);
      }).catch((error) => {
         console.error('Error fetching video data:', error);
         setError('Failed to load video. Please try again.');
         setIsLoading(false);
      });
   }, [videoUrl]);

   const iframeSrc = videoData.otp && videoData.playbackInfo
      ? `https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}`
      : '';

   const handleVideoError = () => {
      setError('Video playback failed. Please check your browser settings.');
   };

   if (isLoading) {
      return (
         <div style={{ paddingTop: "41%", position: "relative" }}>
            <div style={{
               position: "absolute",
               top: 0,
               left: 0,
               width: "100%",
               height: "100%",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               backgroundColor: "#000",
               color: "#fff",
               fontSize: "16px"
            }}>
               Loading video...
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div style={{ paddingTop: "41%", position: "relative" }}>
            <div style={{
               position: "absolute",
               top: 0,
               left: 0,
               width: "100%",
               height: "100%",
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               justifyContent: "center",
               backgroundColor: "#000",
               color: "#fff",
               padding: "20px",
               textAlign: "center"
            }}>
               <div style={{ fontSize: "18px", marginBottom: "20px" }}>
                  ⚠️ Video Playback Issue
               </div>
               <div style={{ fontSize: "14px", marginBottom: "20px", lineHeight: "1.5" }}>
                  {error}
               </div>
               <div style={{ fontSize: "12px", lineHeight: "1.6", maxWidth: "400px" }}>
                  <div style={{ marginBottom: "10px" }}><strong>Troubleshooting Steps:</strong></div>
                  <div style={{ marginBottom: "5px" }}>1. Do not watch in incognito mode, try in normal Chrome window</div>
                  <div style={{ marginBottom: "5px" }}>2. Allow from Chrome settings → Site settings → Protected Content</div>
                  <div style={{ marginBottom: "15px" }}>3. Restart device</div>
                  <div>If still not working, please contact support.</div>
               </div>
               <button
                  onClick={() => window.location.reload()}
                  style={{
                     marginTop: "20px",
                     padding: "10px 20px",
                     backgroundColor: "#007bff",
                     color: "#fff",
                     border: "none",
                     borderRadius: "5px",
                     cursor: "pointer",
                     fontSize: "14px"
                  }}
               >
                  Retry
               </button>
            </div>
         </div>
      );
   }

   return (
      <div style={{ paddingTop: "55%", position: "relative" }}>
         {videoData.otp && videoData.playbackInfo && (
            <iframe
               src={iframeSrc}
               style={{
                  border: 0,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  maxWidth: "100%",
               }}
               allowFullScreen
               allow='encrypted-media'
               title={title}
               onError={handleVideoError}
            />
         )}
         {!videoData.otp && !videoData.playbackInfo && !isLoading && (
            <div style={{
               position: "absolute",
               top: 0,
               left: 0,
               width: "100%",
               height: "100%",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               backgroundColor: "#000",
               color: "#fff",
               fontSize: "16px"
            }}>
               Video not available
            </div>
         )}
      </div>
   );
}

export default CoursePlayer;
