# Helm Subcharts Steps


## Build Dockerfile
The Docker image must be built before starting
```bash
docker build -t dependent .
```


## Create default templates
```bash
helm create mysubchart
helm create mychart
```


## Modify templates
### Modify values.yml of mysubchart
    - Set the Docker image called dependent
    - Set the values of the environment variables

### Modify values.yml of mychart
    - Set the Docker image called dependent
    - Set the values of the environment variables
    - Set the values of the environment variables of mysubchart, this overwrites the ones it has
    - Set the port of the mychart service and the mysubchart service in the mychart Chart
    - Set ingress for mychart and mysubchart in the mychart Chart  

### Modify templates/deployment.yml of mychart and mysubchart
    - readinessProbe must have port 3000, and initial delay 5 sec
    - Set env var injection in container  
#### env var injection
```YML
containers:
        - name: {{ .Chart.Name }}
          env:
            {{- toYaml .Values.env | nindent 12 }}
```

### Modify templates/ingress.yml of mychart
add references to values.yml variables instead of fullname variable, so instead of chart's name. also port number matters
```YML
            backend:
              {{- if semverCompare ">=1.19-0" $.Capabilities.KubeVersion.GitVersion }}
              service:
                name: {{ .backend.service.name }}
                port:
                  number: {{ .backend.service.port.number }}
              {{- else }}
              serviceName: {{ .backend.service.name }}
              servicePort: {{ .backend.service.port.number }}
              {{- end }}
```

### Modify templates/service.yml of mychart and mysubchart
add references to values.yml variables instead of chart's name variable
```YML
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.service.name }}
```

### Add the reference to the dependency repo to mychart, Chart.yml:
    - dependencies.repository: "file://../mysubchart"


## Launch project
### Launch ingress proxy
```bash
helm install ingress oci://ghcr.io/nginxinc/charts/nginx-ingress --version 1.1.0
```
### Update the charts that mychart depends on:
```bash
cd mychart
helm dependency update
```
### Then it can be deployed
```bash
helm install my-release .
```
### And check
```bash
kubectl get deployments
kubectl get pods
kubectl logs <pod-name>
kubectl get svc
kubectl get ingress
```
### Make requests to Ingress
go to **localhost/mychart** or **localhost/mysubchart**  
### Make requests directly to the APIs
```bash
kubectl port-forward svc/mychart 8080:3000
kubectl port-forward svc/mysubchart 8081:3000
```