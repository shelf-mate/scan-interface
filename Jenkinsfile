@Library("teckdigital") _
def appName = "scan-interface"

pipeline {
   agent {
    kubernetes {
        inheritFrom "kaniko-template"
    }
  }
    
    stages {
        stage('Build and Tag Image') {
            steps {
                container('kaniko') {
                    script {
                        insertGithubNpmRegistryInfo(secretName: "tpausl-github-token", scope: "shelf-mate")
                        buildDockerImage(additionalImageTags: ["latest"], imageName: "shelf-mate/scan-interface")
                    }
                }
            }
        }
    }
}