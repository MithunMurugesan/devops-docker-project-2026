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
                    bat 'docker build -t booking-backend:latest .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'docker build -t booking-frontend:latest .'
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
                bat 'docker-compose down'
                bat 'docker-compose up -d'
                echo 'Application deployed successfully'
                echo 'Frontend: http://localhost:5175'
                echo 'Backend: http://localhost:5001'
                echo 'MongoDB (Host): localhost:27018'
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
