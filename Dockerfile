#
# Salalem Course Builder Backend for Frontend Docker Image
#
# Repository: https://github.com/Salalem/course-builder-bff
# Maintainers:
#   - Firas Kafri <firas@salalem.com>

# Use 'node:carbon' as a base image.
FROM node:carbon

# Define environment variables.
ENV PROJECT_NAME "course-builder-bff"
ENV WORKSPACE_PATH "/workspace"
ENV PROJECT_PATH $WORKSPACE_PATH/$PROJECT_NAME
ENV SCRIPTS_PATH $PROJECT_PATH/Dockerfiles/scripts
ENV NODE_TMP_PATH /tmp/node

# Copy 'package.json' to $NODE_TMP_PATH and install NPM packages.
WORKDIR $NODE_TMP_PATH
COPY package.json .
RUN npm install

# Copy all files in build context, and Node packages to $PROJECT_PATH.
WORKDIR $PROJECT_PATH
RUN cp -a "$NODE_TMP_PATH/node_modules" .
COPY . .

# Grant 'R-X' permissions to the user for all scripts in $SCRIPTS_PATH.
#RUN chmod -R u+rx $SCRIPTS_PATH/*

# Define ENTRYPOINT array with arguments for 'entrpoint.sh'.
CMD ["node", "index.js"]