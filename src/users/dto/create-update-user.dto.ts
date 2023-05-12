export class CreateOrUpdateUserDto {
    id?: number;
    firstName?: string;
    lastName?: string;
    gender?: string;
    dob?: Date;
    pincode?: string;
    mobileNumber?: string;
    email?: string;
    isKycVerified?: boolean;
    addresses?: Array<Address>
}

export class Address {
    id?: number;
    streetAddress1?: string;
    streetAddress2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    type?: AddressType
}

export enum AddressType {
    OFFICE = "office",
    RESIDENCE = "residence"
}