import { useParams } from 'react-router-dom';

export default function ProfileStub() {
    const { userId } = useParams();

    return (
        <div className="py-20 text-center border border-border rounded-lg bg-code-bg">
            <h1 className="text-3xl font-bold mb-4">Profile Stub</h1>
            <p className="text-text">This is a placeholder for user {userId}'s profile page.</p>
            <p className="text-text mt-2 text-sm">Full implementation is planned for a later phase.</p>
        </div>
    );
}
