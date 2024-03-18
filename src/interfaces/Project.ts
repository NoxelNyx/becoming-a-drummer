import Section from './Section';
import GSBookmark from './GSBookmark';
import User from './User';

export default interface Project {
    id: string,
    type: string,
    title: string,
    sections: Section[],
    gsBookmarks: GSBookmark[],
    videoId: string | null,
    open: boolean,
    inContentLibrary: boolean,
    shared: boolean,
    sharedWith?: User[],
    sharedWithIds?: string[],
    shareLink?: string
};
