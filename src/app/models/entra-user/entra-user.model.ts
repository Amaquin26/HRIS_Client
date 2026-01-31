export interface EntraUser {
    objectId: string;
    displayName: string;
    email?: string | null;
    givenName?: string | null;
    surName?: string | null;
    jobTitle?: string | null;
    mobilePhone?: string | null;
    officeLocation?: string | null;
}