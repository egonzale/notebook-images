#######################
#### GeoPython enabled jupyter datascience-notebook
####      - ref: https://automating-gis-processes.github.io/2017/
#######################


FROM jupyter/datascience-notebook


USER root

# OpenShift allocates the UID for the process, but GID is 0
# Based on an example by Graham Dumpleton
RUN chgrp -R root /home/$NB_USER \
    && find /home/$NB_USER -type d -exec chmod g+rwx,o+rx {} \; \
    && find /home/$NB_USER -type f -exec chmod g+rw {} \; \
    && chgrp -R root /opt/conda \
    && find /opt/conda -type d -exec chmod g+rwx,o+rx {} \; \
    && find /opt/conda -type f -exec chmod g+rw {} \;

RUN ln -s /usr/bin/env /bin/env

ENV HOME /home/$NB_USER

COPY scripts/jupyter/autodownload_and_start.sh /usr/local/bin/autodownload_and_start.sh
RUN chmod a+x /usr/local/bin/autodownload_and_start.sh

# compatibility with old blueprints, remove when not needed
RUN ln -s /usr/local/bin/autodownload_and_start.sh /usr/local/bin/bootstrap_and_start.bash


RUN echo "Enable jupyterlab" \
	&& jupyter serverextension enable --py jupyterlab \
	&& jupyter labextension install jupyterlab_bokeh
	
# GIS env installation

USER 1000
# Set git
ENV GIT_COMMITTER_NAME=anonymous
ENV GIT_COMMITTER_EMAIL=anon@localhost
RUN git clone https://github.com/geo-python/JupyterLab-environment-test.git /home/jovyan/work/JupyterLab-environment-test


RUN echo "Upgrading pip and conda" \
&& pip --no-cache-dir install --upgrade pip \
&& conda update --yes -n base conda  \
&& conda install --yes \
	cython \
	geopandas \
	matplotlib \
	scikit-learn \
	networkx \
	bokeh \
	statsmodels \
	pyspark \
	geoplot \
	osmnx  \
	folium \
	rasterio \
	rasterstats \
	cartopy \
	dash \
	dash-html-components \
	dash-core-components \
&& pip --no-cache-dir install https://github.com/mullenkamp/PyCRS/archive/master.zip

CMD ["/usr/local/bin/autodownload_and_start.sh"]
