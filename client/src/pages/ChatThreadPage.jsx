import { useParams } from 'react-router-dom'

export default function ChatThreadPage() {
  const { id } = useParams()

  return (
    <div>Chat Thread Page: {id}</div>
  )
}
