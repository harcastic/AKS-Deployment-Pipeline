pipeline {

    agent any

    environment {
        NAMESPACE = 'cloudgallery'
    }

    parameters {
        string(
            name: 'IMAGE_TAG',
            defaultValue: 'latest',
            description: 'Docker image tag from GitHub Actions'
        )
    }

    stages {

        stage('Verify Cluster Access') {
            steps {

                sh """
                kubectl get nodes
                kubectl get ns
                """
            }
        }

        stage('Create Kubernetes Secrets') {
            steps {

                withCredentials([
                    string(credentialsId: 'MONGODB_URI', variable: 'MONGODB_URI'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                    string(credentialsId: 'JWT_REFRESH_SECRET', variable: 'JWT_REFRESH_SECRET'),
                    string(credentialsId: 'AZURE_STORAGE_CONNECTION_STRING', variable: 'AZURE_STORAGE_CONNECTION_STRING')
                ]) {

                    sh """
                    kubectl create secret generic cloudgallery-secret \
                    --from-literal=MONGODB_URI="$MONGODB_URI" \
                    --from-literal=JWT_SECRET="$JWT_SECRET" \
                    --from-literal=JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" \
                    --from-literal=AZURE_STORAGE_CONNECTION_STRING="$AZURE_STORAGE_CONNECTION_STRING" \
                    --namespace=$NAMESPACE \
                    --dry-run=client -o yaml | kubectl apply -f -
                    """
                }
            }
        }

        stage('Apply Kubernetes Manifests') {
            steps {

                sh """
                kubectl apply -f k8s/
                """
            }
        }

        stage('Deploy Frontend') {
            steps {

                sh """
                kubectl set image deployment/cloudgalleryfrontend \
                frontend-cont=harcastic/cloudgalleryfrontend:${IMAGE_TAG} \
                -n $NAMESPACE
                """
            }
        }

        stage('Deploy Backend') {
            steps {

                sh """
                kubectl set image deployment/cloudgallerybackend \
                backend-cont=harcastic/cloudgallerybackend:${IMAGE_TAG} \
                -n $NAMESPACE
                """
            }
        }

        stage('Verify Frontend Rollout') {
            steps {

                sh """
                kubectl rollout status deployment/cloudgalleryfrontend \
                -n $NAMESPACE
                """
            }
        }

        stage('Verify Backend Rollout') {
            steps {

                sh """
                kubectl rollout status deployment/cloudgallerybackend \
                -n $NAMESPACE
                """
            }
        }

        stage('Get Services') {
            steps {

                sh """
                kubectl get svc -n $NAMESPACE
                """
            }
        }

        stage('Get Pods') {
            steps {

                sh """
                kubectl get pods -n $NAMESPACE
                """
            }
        }
    }

    post {

        success {
            echo "Cloud Gallery successfully deployed to Kubernetes cluster"
        }

        failure {
            echo "Deployment failed. Check Jenkins logs immediately."
        }

        always {
            sh """
            kubectl get pods -n $NAMESPACE || true
            """
        }
    }
}