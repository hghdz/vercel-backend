import Head from 'next/head'
import dynamic from 'next/dynamic'

const SpeakingSliderApp = dynamic(() => import('../components/SpeakingSliderApp'), { ssr: false })

export default function Home() {
  return (
    <>
      <Head>
        <title>Speaking Slider</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">중국어 말하기 연습</h1>
        <div className="w-full max-w-xl px-4">
          <SpeakingSliderApp />
        </div>
      </main>
    </>
  )
}
