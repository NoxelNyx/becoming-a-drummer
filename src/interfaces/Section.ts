export default interface Section {
    id?: string,
    start?: number,
    end?: number,
    repeat?: boolean,
    gsParams?: string,
    active?: boolean,
    defaultEdit?: boolean,
    isLocal: boolean
    name?: string,
};
