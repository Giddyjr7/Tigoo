import { Link } from 'react-router-dom';

export default function StoriesDrafts() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center mt-4 gap-2">
            <span className="text-[15px] font-medium text-text-h">No drafts yet.</span>
            <span className="text-[15px] text-text mb-4">Start a new story and it'll show up here.</span>
            <Link
                to="/write"
                className="px-5 py-2 rounded-full bg-text-h text-bg text-[14px] font-medium hover:bg-opacity-90 transition-colors"
            >
                Start writing
            </Link>
        </div>
    );
}
