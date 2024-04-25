# Node.js 18 버전을 기반으로 하는 공식 Node.js 이미지를 사용합니다.
FROM node:20.11.0

# 작업 디렉토리를 생성하고 애플리케이션 코드를 복사합니다.
WORKDIR /app

# 애플리케이션 의존성 파일을 복사합니다.
COPY package*.json ./

# 패키지 설치
RUN npm install --verbose

# 소스 코드를 복사합니다.
COPY . .

# 애플리케이션 빌드
RUN npm run build --verbose

# 애플리케이션 실행
CMD ["npm", "start"]