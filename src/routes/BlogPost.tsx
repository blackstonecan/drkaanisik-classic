import { useParams } from 'react-router-dom'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  return (
    <article className="container-prose py-24">
      <h1 className="font-display text-3xl font-semibold text-trust-700">Blog post</h1>
      <p className="mt-2 text-sm text-trust-700/60">
        slug: <code>{slug}</code>
      </p>
    </article>
  )
}
