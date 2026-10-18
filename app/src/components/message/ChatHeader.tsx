

export default function ChatHeader ({username} : {username : string | null | undefined}) {
    return (
        <div className="mx-4 my-4 p-7 text-xl font-extrabold border-b-2 lg:mx-16">
            <h1>{username}</h1>
        </div>
    )
}