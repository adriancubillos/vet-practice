import * as fs from 'fs';
import * as path from 'path';


/**
 /**
 * Utility functions for handling image operations in the repository.
 *
 * This file contains utility functions to manage images associated with entities,
 * including checking image URLs, and deleting old images if necessary.
 *
 * Functions:
 * - imageChecksUtil: Performs checks on image URLs and deletes old images if necessary.
 * - deleteOldIamgeInRepo: Deletes an old image from the repository if a new image is provided.
 * - deleteOldIamgeIfNull: Deletes an old image from the repository if the new image URL is null.
 * - deleteImageInRepo: Deletes an image from the repository based on the entity's image URL.
 *
 * Dependencies:
 * - fs: Node.js file system module to interact with the file system.
 * - path: Node.js path module to handle and transform file paths.
 */


/**
 * Checks and manages image URLs for an entity.
 *
 * This utility function performs several operations on the image URL of an entity:
 * - Converts an empty string imageUrl to null.
 * - Deletes the old image if a new imageUrl is provided.
 * - Deletes the old image if the imageUrl is null.
 *
 * @param entity The entity associated with the image.
 * @param imageUrl The new image URL to check.
 * @param imageRepoPath The path to the image repository.
 */
export const imageChecksUtil = (entity, imageUrl, imageRepoPath) => {
    if (imageUrl === '') { imageUrl = null; }
    deleteOldImageInRepo(entity, imageUrl, imageRepoPath);
    deleteOldImageIfNull(entity, imageUrl, imageRepoPath);
}

/**
 * Deletes the old image from the repository if a new image URL is provided.
 *
 * @param entity The entity associated with the image.
 * @param imageUrl The new image URL.
 * @param imageRepoPath The path to the image repository.
 */
export const deleteOldImageInRepo = (entity, imageUrl, imageRepoPath) => {
    if (imageUrl && entity.imageUrl) {
        const oldImagePath = path.join(process.cwd(), imageRepoPath, path.basename(entity.imageUrl));
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    }
}

/**
 * Deletes the old image from the repository if the new image URL is null.
 *
 * @param entity The entity associated with the image.
 * @param imageUrl The new image URL, which is null.
 * @param imageRepoPath The path to the image repository.
 */
export const deleteOldImageIfNull = (entity, imageUrl, imageRepoPath) => {
    if (imageUrl === null && entity.imageUrl) {
        const oldImagePath = path.join(process.cwd(), imageRepoPath, path.basename(entity.imageUrl));
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    }
}

/**
 * Deletes the image from the repository based on the entity's image URL.
 *
 * @param entity The entity associated with the image.
 * @param imageRepoPath The path to the image repository.
 */
export const deleteImageInRepo = (entity, imageRepoPath) => {
    if (entity.imageUrl) {
        const imagePath = path.join(process.cwd(), imageRepoPath, path.basename(entity.imageUrl));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
}
