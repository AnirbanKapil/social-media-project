

export default function ChatHeader ({username} : {username : string | null | undefined}) {
    return (
        <div className="mx-16 p-7 my-6 text-xl font-extrabold  border-b-2">
            <h1>{username}</h1>
        </div>
    )
}