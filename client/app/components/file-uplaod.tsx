'use client'

import { Upload } from 'lucide-react'
import * as React from 'react'

const FileUploadComponent: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [progressText, setProgressText] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false)

  // Poll job status after upload is complete
  const pollJobStatus = async (jobId: string) => {
    setIsProcessing(true)
    setProgressText('⏳ Processing PDF...')

    let isComplete = false

    while (!isComplete) {
      try {
        const res = await fetch(`http://localhost:8000/status/${jobId}`)
        const data = await res.json()

        if (data.status === 'completed') {
          isComplete = true
          setProgress(100)
          setProgressText('✅ Done! PDF processed successfully.')
          setLoading(false)
          setIsProcessing(false)
        } else if (data.status === 'failed') {
          isComplete = true
          setProgressText('❌ Job failed. Try again.')
          setLoading(false)
          setIsProcessing(false)
        } else {
          setProgress(data.progress || 0) 
          setProgressText(`⏳ Processing... ${data.progress || 0}%`)
          await new Promise((r) => setTimeout(r, 2000))
        }
      } catch (error) {
        setProgressText('❌ Error fetching job status.')
        setLoading(false)
        setIsProcessing(false)
        isComplete = true
      }
    }
  }

  // Handle file input & upload
  const handleFileUpload = () => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.accept = 'application/pdf'
    inputElement.onchange = () => {
      if (inputElement.files?.length) {
        const file = inputElement.files[0]
        const formData = new FormData()
        formData.append('pdf', file)

        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://localhost:8000/upload/pdf', true)

        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100)
            setProgress(percentComplete)
            setProgressText(`Uploading: ${percentComplete}%`)
            setLoading(true)
          }
        }

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            const jobId = response.jobId
            if (jobId) {
              pollJobStatus(jobId)
            } else {
              setProgressText('Upload succeeded but no job ID received.')
              setLoading(false)
              setProgress(0)
            }
          } else {
            setProgressText('Upload failed. Please try again.')
            setLoading(false)
            setProgress(0)
          }
        }

        xhr.onerror = () => {
          setProgressText('Upload error. Please try again.')
          setLoading(false)
          setProgress(0)
        }

        xhr.send(formData)
      }
    }

    inputElement.click()
  }

  return (
    <div className="bg-zinc-950 h-[100vh] text-white shadow-2xl flex flex-col justify-center items-center px-6">
      {loading ? (
        <div className="w-full max-w-md text-center">
          <p className="mb-2 text-gray-400">{progressText}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`bg-blue-600 h-3 transition-all duration-300 ${
                isProcessing ? 'bg-purple-600' : 'bg-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div
          onClick={handleFileUpload}
          className="bg-gray-800 p-6 rounded-2xl cursor-pointer flex flex-col items-center justify-center gap-2 hover:bg-gray-700 transition"
        >
          <Upload size={40} />
          <p className="text-lg">Upload PDF File</p>
        </div>
      )}
    </div>
  )
}

export default FileUploadComponent
