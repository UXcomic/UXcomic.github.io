import React, { useEffect, useState } from 'react'
import { Content } from '../../uxcomic-types'

interface INotionVideoProps {
  content: Content
}

const NotionVideo: React.FC<React.PropsWithChildren<INotionVideoProps>> = ({
  content,
  children,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>(content.data.value)

  useEffect(() => {
    if (videoSrc.indexOf('youtube')) {
      let videoUrl = new URL(videoSrc)
      let videoId = videoUrl.searchParams.get('v')
      if (!videoId) {
        videoId = videoUrl.pathname.split('/')[1]
      }

      setVideoSrc(`https://youtube.com/embed/${videoId}?rel=0`)
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[215px] max-h-[315px] pointer-events-none my-2">
      <iframe
        key={content.id}
        src={videoSrc}
        className="absolute left-0 top-0 w-full h-full border-0 pointer-events-auto"
        frameBorder="0"
        sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin allow-storage-access-by-user-activation allow-popups-to-escape-sandbox"
        allowFullScreen
      />
    </div>
  )
}

export default NotionVideo
