import Section from './Section';
import GSBookmark from './GSBookmark';

export default interface Project {
    id: string,
    type: string,
    title: string,
    sections: Section[],
    gsBookmarks: GSBookmark[],
    videoId: string | null,
    open: boolean,
};
