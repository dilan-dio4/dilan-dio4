export interface Readme {
    tags?: (TagsEntity)[];
    expertise: Expertise;
    projects?: (ProjectsEntity)[];
    bonus?: (BonusEntity)[];
}
export interface TagsEntity {
    name: string;
    badge: string;
    link?: string;
}
export interface Expertise {
    frameworks?: (string)[];
    databases?: (string)[];
    languages?: (string)[];
    AWS?: (string)[];
}
export interface ProjectsEntity {
    name: string;
    description: string;
    tags?: (string)[];
    line?: string;
    links?: (LinksEntity)[];
}
export interface LinksEntity {
    name: string;
    href: string;
}
export interface BonusEntity {
    name: string;
    description: string;
    tags?: (string)[];
    links?: (LinksEntity)[];
}
