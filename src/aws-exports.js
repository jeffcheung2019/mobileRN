/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile = {
    "aws_project_region": "us-west-1",
    "aws_cognito_region": "us-west-1",
    "aws_user_pools_id": "us-west-1_3aSVcN1aJ",
    "aws_user_pools_web_client_id": "76hkjsunat8r0bbktcaj65r9od",
    "oauth": {
        "domain": "tracker-user-domain.auth.us-west-1.amazoncognito.com",
        "scope": [
            "aws.cognito.signin.user.admin",
            "email",
            "openid",
            "phone",
            "profile"
        ],
        "redirectSignIn": "com.fitnessevo://signIn",
        "redirectSignOut": "com.fitnessevo://signOut",
        "responseType": "code"
    },
    "federationTarget": "COGNITO_USER_POOLS",
    "aws_cognito_username_attributes": [],
    "aws_cognito_social_providers": [
        "FACEBOOK",
        "GOOGLE"
    ],
    "aws_cognito_signup_attributes": [],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": [
            "REQUIRES_LOWERCASE",
            "REQUIRES_UPPERCASE",
            "REQUIRES_NUMBERS",
            "REQUIRES_SYMBOLS"
        ]
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ]
};


export default awsmobile;
