import ListCard from '../library/ListCard';

export default function ProfileHome() {
    return (
        <div className="flex flex-col mt-4">
            {/* We'll use ListCard inside a container to match the grid style of the mockup */}
            <div className="grid grid-cols-1 mb-8 max-w-[680px]">
                {/* The ListCard is the "Reading list" matching the mockup */}
                <ListCard title="Reading list" storyCount={3} />
            </div>
        </div>
    );
}
