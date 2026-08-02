import { Link } from 'react-router-dom';

export default function ProfileAbout() {
    return (
        <div className="flex flex-col mt-4 max-w-[680px]">
            <div className="bg-[#f9f9f9] rounded-md p-10 flex flex-col items-center justify-center text-center mb-8">
                <h2 className="text-xl font-bold text-text-h mb-3">Tell the world about yourself</h2>
                <p className="text-[15px] text-text max-w-[400px] mb-8 leading-relaxed">
                    Here's where you can share more about yourself: your history, work
                    experience, accomplishments, interests, dreams, and more. You can
                    even add images and use rich text to personalize your bio.
                </p>
                <button className="px-5 py-2 rounded-full border border-text-h text-text-h text-[15px] font-medium hover:bg-black/5 transition-colors">
                    Get started
                </button>
            </div>
            
            <Link to="#" className="text-accent text-[15px] font-medium hover:text-green-700 transition-colors">
                19 following
            </Link>
        </div>
    );
}
