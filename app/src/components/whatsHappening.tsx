import UsersPage from "./userInfo";


export  function WhatsHappening () {
    return (
        <div className="w-full h-96 bg-gray-200 rounded-lg p-4 m-4">
            <h2 className="text-xl text-slate-600 font-bold mb-2">What's Happening</h2>
            <p className="text-gray-600">Stay updated with the latest news and events!</p>
            <UsersPage />
        </div>
    );
}