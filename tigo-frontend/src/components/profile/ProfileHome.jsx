import ListCard from '../library/ListCard';
import { MOCK_USERS } from '../../mocks/mockData';

export default function ProfileHome({ user = MOCK_USERS[0] }) {
    return (
        <div className="flex flex-col mt-4">
            {/* We'll use ListCard inside a container to match the grid style of the mockup */}
            <div className="grid grid-cols-1 mb-8 max-w-[680px]">
                {/* The ListCard is the "Reading list" matching the mockup */}
                <ListCard title="Reading list" storyCount={3} user={user} />
            </div>
        </div>
    );
}
