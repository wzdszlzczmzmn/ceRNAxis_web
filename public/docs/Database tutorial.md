# Database

## Database Overview

The ceRNAxisDB Database provides two major data resources: RNA expression databases and a ceRNA axis interaction network database\.

The RNA expression databases are organized by RNA biotype and include four sub\-databases:

- mRNA expression database

- miRNA expression database

- lncRNA expression database

- circRNA expression database

Each RNA expression database contains curated transcriptomic datasets from public cancer resources, including TCGA, GEO, TARGET, TISCH2 and scTML\. For each RNA type, users can browse available datasets, check dataset\-level metadata, and download expression matrices and corresponding metadata and analysis files 

The ceRNA axis interaction network database provides ceRNA regulatory relationships\. These networks are used to infer potential miRNA\-mediated regulatory axes among mRNAs, lncRNAs, circRNAs, and miRNAs\.



## Dataset Table in Each RNA Expression Database

Each RNA expression database page displays a dataset\-level metadata table\. The table summarizes the available datasets for the selected RNA type\.

![image\.png](img/image%209.png)

For example, when users enter the miRNA expression database, the table only displays datasets whose `Gene bio type` is `miRNA`\. Similarly, the miRNA, lncRNA, and circRNA pages display datasets with `miRNA`, `lncRNA`, and `circRNA`, respectively\.

The dataset table includes the following information:

Click the `Detail` button to access comprehensive info for the selected dataset, including basic information of this dataset and interactive visualizations\.

## RNA Expression Databases

Each RNA expression dataset may provide the following files\.

### Dataset Information Panel

![image\.png](img/image%203.png)

The Dataset Information section provides info is the same as above

### Samples Meta Panel

![image\.png](img/image%2010.png)

The **Sample Meta** panel displays sample\-level clinical and annotation information for the selected dataset\. Each row represents one biological sample, and the **Sample ID** links the metadata record to the corresponding RNA expression matrix\. The table includes dataset information, disease type, primary site, tumor stage, TNM stage, tumor grade, demographic information, survival\-related variables, and case\-control grouping\. These annotations help users browse samples, interpret expression profiles, define comparison groups, and perform downstream clinical or survival analyses\. 

### Aliquot Expression Panel

![image\.png](img/image%205.png)

Aliquot Expression Files panel lists downloadable Aliquot\-level expression matrices for the selected dataset\. Available expression types differ by RNA biotype: mRNA and lncRNA datasets provide `log2count`, `log2fpkm`, `log2fpkmuq`, and `log2tpm` files; miRNA datasets provide `log2rpm` files; and circRNA datasets provide `count` files\. Users can download the required file for downstream analysis\.



### Expression Matrix Panel

![image\.png](img/image%206.png)

**Expression Matrix Panel** displays the expression values of selected genes across samples in the selected dataset\. Users can input or browse gene symbols, apply selected genes, and view their expression values in a searchable and sortable table\. Each row represents one sample, and each column represents one selected gene\.

Available expression matrix panels differ by RNA biotype: **mRNA** and **lncRNA** datasets include `log2count`, `log2fpkm`, `log2fpkmuq`, and `log2tpm` panels; **miRNA** datasets include a `log2rpm` panel; and **circRNA** datasets include a `count` panel\. A maximum of 30 genes can be selected for display at one time\.



### Expression Volcano Plot

![image\.png](img/image%201.png)

The **Expression Volcano Plot** panel shows differential expression results for the selected dataset and expression type\. Each point represents one gene, with log2 fold change on the x\-axis and −log10 p\-value on the y\-axis\. Up\-regulated, down\-regulated, and non\-significant genes are shown separately\. You can highlight genes, show labels, and adjust plot appearance\.



## mRNA Annotation Module

![image\.png](img/image%207.png)



Unlike miRNA, lncRNA, and circRNA dataset pages, the **mRNA Dataset List** includes an additional **Annotation** module, provides functional and ceRNA\-related annotations for the selected mRNA dataset\. You can view dataset information, explore ceRNA regulatory networks, check matched ceRNA axes, and inspect downstream analysis results\.

### ceRNA Annotation Network

![image\.png](img/image%208.png)

The **ceRNA Annotation Network** module visualizes regulatory relationships among mRNAs, miRNAs, lncRNAs, and circRNAs\. Nodes represent RNA molecules, and edges represent interaction types such as miRNA\-mRNA, miRNA\-lncRNA, and miRNA\-circRNA interactions\. You can search specific RNAs or immune\-related annotations, refresh the network, clear the current view, and fit the network to the screen\.

### ceRNA Axis Final Results

![截屏2026\-06\-30 10\.24\.43\.png](img/截屏2026-06-30%2010.24.43.png)

The **ceRNA Axis Final Results** table lists the final ceRNA axes identified for the selected mRNA dataset\. Each row represents one ceRNA axis and includes information such as axis ID, axis type, axis regulation pattern, and RNA components\. You can use this table to check which mRNAs are involved in ceRNA regulatory axes and identify their matched miRNAs, lncRNAs, or circRNAs\.



### CMap Results

![截屏2026\-06\-30 10\.24\.58\.png](img/截屏2026-06-30%2010.24.58.png)

The **CMap Results** module shows perturbation signatures associated with the selected dataset or ceRNA\-related expression pattern\. Each row represents one perturbation category and includes the perturbation ID, perturbation name, and perturbation type\. You can use this table to explore candidate perturbations or biological signatures linked to the dataset\.



### Expression Volcano Plot

![截屏2026\-06\-30 10\.18\.40\.png](img/截屏2026-06-30%2010.18.40.png)



The **Expression Volcano Plot** visualizes differential expression results for the selected RNA type\. Each point represents one gene, with log2 fold change on the x\-axis and statistical significance on the y\-axis\. You can adjust thresholds, highlight genes, show labels, and change plot appearance to identify up\-regulated and down\-regulated genes\.

### Log2FC Correlation Plot

![截屏2026\-06\-30 10\.25\.26\.png](img/截屏2026-06-30%2010.25.26.png)

The **Log2FC Correlation Plot** compares log2 fold change values between interacting RNA pairs, such as miRNA\-mRNA pairs\. It helps you evaluate whether the paired RNAs show the expected regulatory direction\. You can choose the interaction type, highlight specific RNAs, and adjust the display style\.

### Expression Correlation Plot

![截屏2026\-06\-30 10\.25\.38\.png](img/截屏2026-06-30%2010.25.38.png)

The **Expression Correlation Plot** shows the expression relationship between a selected RNA pair across samples\. You can select an interaction type and gene pair, view correlation statistics, and optionally display a regression line\. This module helps you check whether two RNAs show positive or negative expression correlation\.

### Survival Analysis

![截屏2026\-06\-30 10\.40\.29\.png](img/截屏2026-06-30%2010.40.29.png)

The **Survival Analysis** module evaluates whether ceRNA\-axis\-based sample groups are associated with survival outcomes\. It displays survival curves, sample numbers, group information, and log\-rank p values\. You can show confidence intervals, display symbols, and adjust line width\.



### DEG Pathway Enrichment Plot

![截屏2026\-06\-30 10\.40\.47\.png](img/截屏2026-06-30%2010.40.47.png)

The **DEG Pathway Enrichment Plot** summarizes pathway enrichment results based on differentially expressed genes\. Each bubble represents one pathway\. The plot can be ranked by enrichment score or other available metrics, and you can control the number of displayed pathways, search specific pathways, and adjust bubble size\.

## ceRNA Axis Interaction Network Database

![image\.png](img/image%202.png)

The **ceRNA Axis Interaction Network Database** lists curated RNA\-RNA interaction records used as the background catalogue for ceRNA axis analysis\. You can search miRNAs or ceRNAs, filter by species, source database, and interaction type, and browse evidence from resources such as ENCORI, miRDB, miRTarBase, miRWalk, NPInter, RNAInter, and TargetScan\. Each record contains the miRNA, ceRNA, species, database source, and interaction type\.

