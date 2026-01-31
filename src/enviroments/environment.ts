export const environment = {
    production: false,
    environmentName: 'local',
    baseUrl: 'http://localhost:4200',
    employeeApiBaseUrl: 'https://localhost:7240/api',
    clientId: '<CLIENT-ID>',
    authority:'https://<TENANT-NAME>.ciamlogin.com/<TENANT-ID>',
    apiScopes: [
        'api://<API-CLIENT-ID>/.default'
    ]
}