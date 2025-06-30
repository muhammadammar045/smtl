pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }

    environment {
        REPO_URL = 'https://github.com/muhammadammar045/smtl.git'
        APP_NAME = 'school-management-technologies-limited'
        APP_PORT = '4300'
    }

    stages {
        stage('Set Environment Variables') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'prod') {
                        env.NODE_LABEL = 'production'
                        env.SERVER_USER = 'jenkins'
                        env.SERVER_IP = 'prod-server-ip'
                        env.APP_DIR = '/var/www/smtl-prod'
                        env.OWNER_USER = 'ubuntu'
                    } else if (env.BRANCH_NAME == 'uat') {
                        env.NODE_LABEL = ''
                        env.SERVER_USER = 'jenkins'
                        env.SERVER_IP = '13.50.119.217'
                        env.APP_DIR = '/var/www/smtl-uat'
                        env.OWNER_USER = 'jenkins'
                    } else {
                        error "Unsupported branch: ${env.BRANCH_NAME}"
                    }
                }
            }
        }

        stage('Prepare Deployment Directory') {
            agent { label "${env.NODE_LABEL}" }
            steps {
                script {
                    sh """
                        echo "🔧 Creating deployment directory..."
                        sudo mkdir -p ${env.APP_DIR} || exit 1
                        sudo chown -R ${env.OWNER_USER}:${env.OWNER_USER} ${env.APP_DIR} || exit 1
                        sudo chmod -R 775 ${env.APP_DIR} || exit 1

                        echo "🧹 Cleaning old deployment files..."
                        sudo rm -rf ${env.APP_DIR}/* || exit 1

                        echo "📁 Copying new workspace files..."
                        sudo cp -r ${WORKSPACE}/* ${env.APP_DIR}/ || exit 1

                        echo "✅ Deployment folder prepared."
                    """
                }
            }
        }

        stage('Install Dependencies') {
            agent { label "${env.NODE_LABEL}" }
            steps {
                script {
                    sh """
                        sudo chown -R jenkins:jenkins ${env.APP_DIR} || exit 1

                        export NVM_DIR="/var/lib/jenkins/.nvm"
                        [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
                        nvm use 23 || exit 1

                        cd ${env.APP_DIR}
                        echo "📦 Installing dependencies..."
                        npm install || exit 1
                    """
                }
            }
        }

        stage('Build Application') {
            agent { label "${env.NODE_LABEL}" }
            steps {
                script {
                    sh """
                        export NVM_DIR="/var/lib/jenkins/.nvm"
                        [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
                        nvm use 23 || exit 1

                        cd ${env.APP_DIR}
                        echo "🏗️ Building application..."
                        npm run build || exit 1
                    """
                }
            }
        }

        stage('Setup PM2 & Run App') {
            agent { label "${env.NODE_LABEL}" }
            steps {
                script {
                    sh """
                        cd ${env.APP_DIR}

                        echo "🛠️ Creating PM2 ecosystem config..."
                        cat <<EOF > ecosystem.config.js
                        module.exports = {
                            apps: [
                                {
                                    name: "${APP_NAME}",
                                    script: "npx",
                                    args: "serve -s build -l ${APP_PORT}",
                                    cwd: "${env.APP_DIR}",
                                    env: {}
                                }
                            ]
                        };
                        EOF

                        export NVM_DIR="/var/lib/jenkins/.nvm"
                        [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
                        nvm use 23 || exit 1

                        echo "🚀 Restarting app with PM2..."
                        pm2 delete ${APP_NAME} || true
                        pm2 start ecosystem.config.js || exit 1
                        pm2 save

                        echo "✅ App is running on port ${APP_PORT}"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment to ${env.BRANCH_NAME} completed successfully."
        }
        failure {
            echo "❌ Deployment to ${env.BRANCH_NAME} failed."
        }
    }
}