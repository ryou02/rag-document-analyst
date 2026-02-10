import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import useAuth from '../hooks/useAuth.js'
import fileUploadImg from '../assets/fileupload.png'

const DEFAULT_BUCKET = 'documents'

export default function FileUpload({ onClose, onUploaded, projectId }) {
  const { user } = useAuth()  
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleUpload = async (selectedFile) => {
    setError('')
    setSuccess('')

    if (!selectedFile) {
      setError('Select a PDF to upload.')
      return
    }

    if (!user || !projectId) {
      setError('You must be signed in to upload.')
      return
    }

    setUploading(true)
    const filePath = `${user.id}/${Date.now()}-${selectedFile.name}`

    const { error: uploadError } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: true,
      })

    setUploading(false)

    if (uploadError) {
      setError(uploadError.message)
      return
    }

    const { error: insertError } = await supabase.from('documents').insert({
      user_id: user.id,
      title: selectedFile.name,
      storage_path: filePath,
      project_id: projectId,
    })

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess('Upload complete.')
    setFile(null)
    onUploaded?.()
    onClose?.()
  }

  return (
    <div className="px-8 py-7 text-sm text-slate-600">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xl font-semibold text-slate-900">Add sources</div>
          <p className="mt-1 text-sm text-slate-500">Upload a PDF to your workspace.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
        >
          Close
        </button>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
        <div className="mt-2 text-sm font-semibold text-slate-700">Drop your PDF here</div>
        <div className="mt-2 text-xs text-slate-400">or upload a file</div>
        <label className="mx-auto mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50">
          Upload files
          <img src={fileUploadImg} alt="" className="h-5 w-5" />
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => {
              const selected = event.target.files?.[0] ?? null
              setFile(selected)
              handleUpload(selected)
            }}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {uploading ? <span className="text-xs text-slate-500">Uploading...</span> : null}
        {!uploading && file ? <span className="text-xs text-slate-500">Selected: {file.name}</span> : null}
      </div>

      {error ? <p className="mt-3 text-xs text-red-500">{error}</p> : null}
      {success ? <p className="mt-3 text-xs text-green-600">{success}</p> : null}
    </div>
  )
}
