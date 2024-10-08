@Library("teckdigital") _
def appName = "iam-ui"
def localBranchToGitopsValuesPath = [
    'main': 'core/iam/iam-ui-values.yml',
]

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