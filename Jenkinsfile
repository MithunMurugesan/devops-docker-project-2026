pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t booking-backend:latest .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t booking-frontend:latest .'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add test commands here
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
                echo 'Application deployed successfully'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
        success {
            echo 'Build and Deployment Successful!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
