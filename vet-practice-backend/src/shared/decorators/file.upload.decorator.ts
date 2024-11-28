import {
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    UploadedFile
} from '@nestjs/common';

/**
 * File upload decorator
 * @param maxSizeInMB get the size in MB    
 * @param fileTypes get the file types as a regular expression
 * @param fileIsRequired get if the file is required
 * @returns the file upload decorator
 */

export const CreateFileUploadDecorator = (
    maxSizeInMB: number = 5,
    fileTypes: RegExp = /(jpg|jpeg|png)$/,
    fileIsRequired: boolean = false,
) => {
    return UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: maxSizeInMB * 1024 * 1024 }),
                new FileTypeValidator({ fileType: fileTypes }),
            ],
            fileIsRequired: fileIsRequired,
        })
    );
};