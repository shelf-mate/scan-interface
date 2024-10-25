@Library("teckdigital") _
def appName = "scan-interface"
pipeline {
    agent {
        kubernetes {
            inheritFrom "kaniko-template"
        }
    }
   
    stages {
        stage('Setup QEMU') {
            steps {
                container('kaniko') {
                    sh '''
                    mkdir -p /workspace/qemu
                    wget https://github.com/multiarch/qemu-user-static/releases/download/v5.2.0-2/qemu-aarch64-static -O /workspace/qemu/qemu-aarch64-static
                    chmod +x /workspace/qemu/qemu-aarch64-static
                    '''
                }
            }
        }

        stage('Build and Tag Image') {
            steps {
                container('kaniko') {
                    script {
                        insertGithubNpmRegistryInfo(secretName: "tpausl-github-token", scope: "shelf-mate")
                        buildDockerImage(
                            additionalImageTags: ["latest-arm"], 
                            imageName: "shelf-mate/scan-interface", 
                            buildArgs: [
                                "--custom-platform=linux/arm64",
                                "--base-image-platform=linux/arm64"
                            ]
                        )
                    }
                }
            }
        }
    }
}