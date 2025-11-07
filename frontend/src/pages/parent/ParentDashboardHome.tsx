export default function ParentDashboardHome() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome to Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Select an option from the navigation below to get started
                </p>
            </div>
        </div>
    );
}


