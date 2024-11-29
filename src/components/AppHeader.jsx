function AppHeader() {
    return (
        <header className="bg-base-300 h-20 flex items-center justify-between p-4">
            <h1 className="text-xl">E-Comm Emergency Reporting System</h1>

            <button className="btn btn-primary">
                {/*This icon is from Google Material Icons (https://fonts.google.com/icons) (emergency)*/}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M410-120v-238L204-239l-70-121 206-120-206-119 70-121 206 119v-239h140v239l206-119 70 121-206 119 206 120-70 121-206-119v238H410Z"/></svg>
                Report Emergency
            </button>
        </header>
    )
}

export default AppHeader
