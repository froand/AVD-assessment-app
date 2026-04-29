metadata description = 'Deploy AVD Security Assessment App to Azure Static Web Apps'

param location string = 'westeurope'
param appName string = 'avd-assessment-app'
param repositoryUrl string
param branch string = 'main'
param repositoryToken string

// Static Web Apps resource
resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: appName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: branch
    repositoryToken: repositoryToken
    provider: 'GitHub'
    buildProperties: {
      appLocation: 'app'
      apiLocation: ''
      outputLocation: 'dist'
      appBuildCommand: 'npm run build'
    }
  }
}

// Output the Static Web App details
output staticWebAppUrl string = staticWebApp.properties.defaultHostname
output staticWebAppName string = staticWebApp.name
output resourceId string = staticWebApp.id
