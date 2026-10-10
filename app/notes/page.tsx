import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'

async function Notes() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Notes />
    </Suspense>
  )
}
