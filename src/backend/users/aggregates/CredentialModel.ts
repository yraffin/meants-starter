/**
 * @swagger
 * definitions:
 *   CredentialModel:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */
export class CredentialModel {
    email: string;
    password: string;
}
