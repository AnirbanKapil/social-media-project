


export function Loader () {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='flex flex-col items-center gap-4'>
                <div className='h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
                <p className='text-white text-lg font-medium'>Loading...</p>
            </div>
        </div>
    )
}

