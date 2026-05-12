--
-- PostgreSQL database dump
--

\restrict C72PZu7Me2bCbyllwoQZz6DaYIvxRjRvXjTcrr8JXOqP2zL1QBKov6vlSpKy1Y7

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.roles (id, role) FROM stdin;
1	ADMIN
2	BUYER
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.users (id, dni_number, first_name, last_name, password, username, role_id) FROM stdin;
1	88694321	Jhon	Admin	$2a$10$dnk1NwSJxzjFAD/Pmp0Pxu5KlqXskFEJ8e90e7//fatlRPh49fqX.	useradmin	1
2	88697867	Juan	Admin	$2a$10$Oc21CsL3.EL1T7MKDbKzzOI8GBXw.KWAAD8dE7KdZH/BEJ2OlZwne	useradmin1	1
3	12345678	Ana	Admin	$2a$10$LotCHC65imZBFomhxPd1/uc.1SSBFgk8e0Du/yuRt5GeQr65qh/A.	useradmin2	1
4	98765432	Maria	Admin	$2a$10$hzGehOo/C3GkdHf5V.u37O4GFhix0DitzU4RwBpVy7YdEYBD/bmf6	useradmin3	1
5	11111111	Luis	Admin	$2a$10$k1hgxWBpIEwYSWHEcuNKJu0qIF5GeSy3wWYjHy6nCFwXQpq4CDUuS	useradmin4	1
6	22222222	Carlos	Admin	$2a$10$xpTrNFZHor09OEieCqKnjenuQiLnCvDhVZQXEcf.vMBf6QVNzNH/6	useradmin5	1
7	33333333	Pedro	Admin	$2a$10$ZVMcL8.lIccsAWC81gBSHe5/nmgqsC5kh50xqzXTZ8fjxyAikvc4i	useradmin6	1
8	44444444	Jose	Admin	$2a$10$R9o3aAjYydU6jNkLI9SjGeiVrhgvg4aWbQro2qwXnwNTQLoqPatlW	useradmin7	1
9	55555555	Fernando	Admin	$2a$10$8J0u7Yjy.SLs.79FCH9Uo.JOwOHqvpvuB8myd6RflWFNDhF04iAUK	useradmin8	1
10	66666666	Daniel	Admin	$2a$10$0Vs.nPvXWsVvol9M9n/61eBXbCjTjY5Rr3bEJYQJDoy1eZDqLa17u	useradmin9	1
11	77777777	Isabella	Admin	$2a$10$.I3aIU5kw7vFg/DqQ7xSrO9Zcw09bQcr.EJf3f.XUZ9g9hngAJ2A6	useradmin10	1
12	88888888	Luz	Admin	$2a$10$1zQ3u5dZjyFTwyVA84MvR.UYEpeTQY1Rj40Q8dgkIfDkQjKQQCdqq	useradmin11	1
13	99999999	Fernanda	Admin	$2a$10$7cKYQby6aLCrSlfVpdRaju6LdKubQQ721WzOU2GXhvW93Y.h5Bl3G	useradmin12	1
14	11111222	Mariana	Admin	$2a$10$ubtQg.odaZruxyg5E05CeOXWJDW7OUPb6kSZX.oEiWQpZxtrNG8ie	useradmin13	1
15	11112222	Ana	Admin	$2a$10$8ho2cQmOZKcCuw7ne6a2du/iYW3yLzXvX2nMdQz2pDsNUImekNH3G	useradmin14	1
16	33344444	Julieta	Admin	$2a$10$HU1xng1xqTBZdHJVl0xR1OH/uF6fjf2ei9rRSoSG5WkODjxHecpJ2	useradmin15	1
17	12367823	Andrea	Buyer	$2a$10$KE2PR8p4Y0zN8Q3.awuFYegxzjU9iLN6i5Z9Dph4FcmHx1kTX2SDa	userbuyer1	2
18	48572930	Ariel	Buyer	$2a$10$JEUEHXM1egzDc5DfTHHbLulpl2HzFZLSrjGeCifsgw6Nue63O99BO	userbuyer2	2
19	39940392	Samuel	Buyer	$2a$10$QzrVwDB/68FDHYYHPfDSgOHJ8/A.MJw7oQCEtXQ./z6z5K5FnL/Um	userbuyer3	2
20	39485043	Gabriel	Buyer	$2a$10$tclNT3.3ucQNG.VnXy1zc.4Yf37rXLDa3SXXxRSF4yMuF7Q2VPJaO	userbuyer4	2
21	04958374	Tomas	Buyer	$2a$10$zoCr7QB5wwwxIV0abDlUseUK7X2/9D36RpzfwzeIE2MmTQRi8alq6	userbuyer5	2
22	75894058	Bruno	Buyer	$2a$10$gk6QtemZ7/RDS7gzIi7goOF4mO9gb6Pu/QJGp.OWuqhnEmG39TbFW	userbuyer6	2
23	95837489	Adrian	Buyer	$2a$10$l0E9wl0j71Af0yYxAmyjJuDHqGPpUfHr6NqD5PwUdqqq6y2usbs36	userbuyer7	2
24	87462932	Elena	Buyer	$2a$10$f7YjNX2tne/k9qxaDN70xu0Fx8.VR8MfJQf4aMZnP56uw6aEU.a0q	userbuyer8	2
25	94856152	Victoria	Buyer	$2a$10$xf1vAraNT0/BQ.uOIbOc3e/yIm39Vrn5imhmoaV70sAJl5MpsbG2S	userbuyer9	2
26	13849248	Claudia	Buyer	$2a$10$y6tWXIOJ0LoXuyHgs/IgROrBnM65iLPzvk7PDzbHueXUZeVATdQii	userbuyer10	2
27	03942739	Natalia	Buyer	$2a$10$zd.jvY7OSP9CXy/7twvGM.9w0goRfqQbcnm/cGI7zvrPspbqNvqvS	userbuyer11	2
28	94726372	Emilia	Buyer	$2a$10$eNiUkB/6v09ARx1sYjfmHexv/.3Xcc0BpCxzNSrPxdj1cE0SgWTr2	userbuyer12	2
29	74857945	Paula	Buyer	$2a$10$wnvzN02o/0f7.N0UnD1DuuUxsRi75xxZJGzZ2y9AQIyILXWKcRpuy	userbuyer13	2
30	83749203	Sam	Buyer	$2a$10$bHQlIDJJ5yyFVCgH5zeWeeF1bpo0ZYBLzwG/WiarW9UTluXQQtBv6	userbuyer14	2
31	88372832	Noel	Buyer	$2a$10$69YWbAnyazpv.sGcHe4RUOVjx5Wp8GxCEnY5gSid26PTVARMxUlo.	userbuyer15	2
\.


--
-- Data for Name: buyers; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.buyers (email, id) FROM stdin;
example1@gmail.com	17
example2@gmail.com	18
example3@gmail.com	19
example4@gmail.com	20
example5@gmail.com	21
example6@gmail.com	22
example7@gmail.com	23
example8@gmail.com	24
example9@gmail.com	25
example10@gmail.com	26
example11@gmail.com	27
example12@gmail.com	28
example13@gmail.com	29
example14@gmail.com	30
example15@gmail.com	31
\.


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.addresses (id, active, latitude, longitude, name, reference, buyer_id) FROM stdin;
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.admins (created_at, id) FROM stdin;
2026-05-12 12:15:00.518796	1
2026-05-12 12:15:00.62094	2
2026-05-12 12:15:00.696461	3
2026-05-12 12:15:00.7709	4
2026-05-12 12:15:00.847056	5
2026-05-12 12:15:00.922376	6
2026-05-12 12:15:00.996397	7
2026-05-12 12:15:01.070576	8
2026-05-12 12:15:01.143248	9
2026-05-12 12:15:01.218419	10
2026-05-12 12:15:01.29219	11
2026-05-12 12:15:01.366377	12
2026-05-12 12:15:01.44044	13
2026-05-12 12:15:01.51446	14
2026-05-12 12:15:01.588583	15
2026-05-12 12:15:01.663668	16
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.brands (id, name) FROM stdin;
1	dog chow
2	angies boutique
3	petstyle
4	walkmate
5	happypet
6	cozypaws
7	vetcare
8	petkitchen
9	safetravel pet
10	naturebites
11	nightpaw
12	sloweat pet
13	furclean
14	catpure
15	scratchy
16	playpet
17	vitapet
18	walkpro
19	homepaw
20	ecopet
21	controldog
22	dentapet
23	hydrapet
\.


--
-- Data for Name: buyer_images; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.buyer_images (id, url, buyer_id) FROM stdin;
\.


--
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.cards (id, active, due_date, name, number, buyer_id) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.categories (id, name) FROM stdin;
1	alimentación
2	aseo
3	accesorios
4	juguetes
5	dormitorio
6	transporte
7	salud
8	descanso
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.orders (id, order_at, order_status, shipping_status, total_price, tracking_code, buyer_id) FROM stdin;
1	2026-05-12 12:16:33.2629	PAID	IN_TRANSIT	12.00	hce30e7pqcuaf0n6	17
2	2026-05-12 12:16:33.28893	PAID	IN_TRANSIT	51.00	dssidz59wvl0pf9n	18
3	2026-05-12 12:16:33.306123	PAID	IN_TRANSIT	32.00	tg6bx9e6l4d1tnem	19
4	2026-05-12 12:16:33.322933	PAID	IN_TRANSIT	56.00	pxhdpxgdrdsmb2qe	20
5	2026-05-12 12:16:33.338516	PAID	IN_TRANSIT	40.00	iis6f3p3uzlnclad	21
6	2026-05-12 12:16:33.35331	PAID	IN_TRANSIT	115.00	xhqakt177ymjswn0	22
7	2026-05-12 12:16:33.36963	PAID	IN_TRANSIT	29.00	xyttrb6ahetpjzgd	23
8	2026-05-12 12:16:33.384674	PAID	IN_TRANSIT	39.00	7hvlp07wwe1wvomz	24
9	2026-05-12 12:16:33.399205	PAID	IN_TRANSIT	30.00	sh0a2t2z9bftqnq2	25
10	2026-05-12 12:16:33.414549	PAID	IN_TRANSIT	42.00	zq65eg9rfdd6z791	26
11	2026-05-12 12:16:33.430634	PAID	IN_TRANSIT	20.00	yws802bybubg1wby	27
12	2026-05-12 12:16:33.448413	PAID	IN_TRANSIT	43.00	af7bq1mevyzfv0vf	28
13	2026-05-12 12:16:33.465964	PAID	IN_TRANSIT	31.00	86ms0bg6r76wxzrk	29
14	2026-05-12 12:16:33.483673	PAID	IN_TRANSIT	85.00	q1uv4f9gufj54m1j	30
15	2026-05-12 12:16:33.502163	PAID	IN_TRANSIT	43.00	eeiu57prj3jtik34	31
\.


--
-- Data for Name: sub_categories; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.sub_categories (id, name, category_id) FROM stdin;
1	croquetas	1
2	dispensador	2
3	collar	3
4	mordedor	4
5	cama	5
6	shampoo	2
7	plato	1
8	transportador	6
9	snack	1
10	cepillo	2
11	arena	2
12	rascador	4
13	pelota	4
14	vitamina	7
15	correa	3
16	casa	8
17	bolsa	2
18	fuente	1
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.products (id, active, created_at, description, name, price, rating, review_count, share_code, sold_count, stock, brand_id, category_id, admin_id, sub_category_id) FROM stdin;
3	t	2026-05-12 12:15:09.4977	Collar resistente y cómodo para perros de todas las tallas	Collar ajustable	8.0000	0	0	dw7397ue6w	0	100	3	3	1	3
4	t	2026-05-12 12:15:12.863131	Correa extensible hasta 5 metros con sistema de bloqueo	Correa retráctil	15.0000	0	0	ui34jhc6f2	0	100	4	3	1	3
13	t	2026-05-12 12:15:47.945113	Cepillo para eliminar pelo muerto en perros y gatos	Cepillo quitapelo	6.0000	0	0	o2m3fn3uj9	0	100	13	2	1	10
14	t	2026-05-12 12:15:51.882671	Arena aglomerante con control de olores	Arena para gatos	12.0000	0	0	txk0waxzwp	0	100	14	2	1	11
16	t	2026-05-12 12:15:59.661352	Pelota que rebota irregularmente para estimular el juego	Pelota interactiva	5.0000	0	0	cuilevukus	0	100	16	4	1	13
19	t	2026-05-12 12:16:10.304253	Casa portátil y resistente al clima	Casita para perros pequeños	28.0000	0	0	ayq9mn4mwp	0	100	19	8	1	16
20	t	2026-05-12 12:16:13.787241	Bolsas ecológicas para recoger desechos de mascotas	Bolsas biodegradables	4.0000	0	0	e8c5okrzk4	0	1000	20	2	1	17
23	t	2026-05-12 12:16:26.023449	Dispensador de agua con filtrado continuo	Fuente de agua automática	22.0000	0	0	xt4x4b4d1s	0	100	23	1	1	18
22	t	2026-05-12 12:16:22.178139	Premios que ayudan a limpiar los dientes del perro	Snack dental	6.0000	0	0	trfpcpiw4k	0	98	22	1	1	9
21	t	2026-05-12 12:16:17.476861	Arnés cómodo para control de perros durante el paseo	Arnés ajustable	11.0000	0	0	a5v3grtcdi	0	97	21	3	1	3
10	t	2026-05-12 12:15:35.801557	Premios saludables ricos en proteína	Snack natural de pollo	5.0000	0	0	vj65td6arh	0	94	10	1	1	9
12	t	2026-05-12 12:15:44.050478	Comedero diseñado para evitar que el perro coma demasiado rápido	Plato antivoracidad	7.0000	0	0	41755uoyf7	0	98	12	1	1	7
2	t	2026-05-12 12:15:06.194577	Comida para todos	Dispensador de comida	10.0000	0	0	jt0h8773if	0	97	2	2	1	2
11	t	2026-05-12 12:15:39.796962	Collar con luz LED para paseos nocturnos seguros	Collar LED luminoso	9.0000	0	0	4h2zzv3zxj	0	97	11	3	1	3
7	t	2026-05-12 12:15:24.951067	Shampoo especial para eliminar pulgas y garrapatas	Shampoo antipulgas	9.0000	0	0	v61lxuxcyf	0	97	7	2	1	6
17	t	2026-05-12 12:16:03.236321	Suplemento vitamínico para mejorar la salud general	Vitaminas para perros	14.0000	0	0	7he4zjkxr5	0	96	17	7	1	14
5	t	2026-05-12 12:15:16.353141	Juguete de goma resistente para reducir ansiedad y estrés	Juguete mordedor	6.0000	0	0	1962vtbhvh	0	94	5	4	1	4
18	t	2026-05-12 12:16:06.780081	Permite pasear dos perros al mismo tiempo	Correa doble para paseo	13.0000	0	0	vpo0fjytdu	0	96	18	3	1	15
6	t	2026-05-12 12:15:21.776986	Cama acolchada con base antideslizante	Cama para perro mediano	25.0000	0	0	i1y0vrz4el	0	98	6	5	1	5
9	t	2026-05-12 12:15:31.809442	Caja de transporte segura para viajes cortos y largos	Transportadora para mascotas	35.0000	0	0	6n2r73zls7	0	96	9	6	1	8
1	t	2026-05-12 12:15:01.855061	Chow Chow	Croquetas	10.0000	0	0	wn7qicm041	0	92	1	1	1	1
8	t	2026-05-12 12:15:28.324275	Bowl doble para agua y comida, fácil de limpiar	Comedero doble acero inoxidable	12.0000	0	0	c5czpdyrs3	0	96	8	1	1	7
15	t	2026-05-12 12:15:56.087661	Rascador de cartón resistente para gatos	Rascador para gatos	11.0000	0	0	0taabpj7mu	0	97	15	4	1	12
\.


--
-- Data for Name: details; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.details (id, quantity, total, order_id, product_id) FROM stdin;
1	2	12.00	1	22
2	3	18.00	2	5
3	3	33.00	2	21
4	2	20.00	3	1
5	1	12.00	3	8
6	3	42.00	4	17
7	2	14.00	4	12
8	3	30.00	5	2
9	2	10.00	5	10
10	1	10.00	6	1
11	3	105.00	6	9
12	2	24.00	7	8
13	1	5.00	7	10
14	3	39.00	8	18
15	3	30.00	9	1
16	3	27.00	10	7
17	3	15.00	10	10
18	1	9.00	11	11
19	1	11.00	11	15
20	1	14.00	12	17
21	2	18.00	12	11
22	1	11.00	12	15
23	1	13.00	13	18
24	3	18.00	13	5
25	2	50.00	14	6
26	1	35.00	14	9
27	2	20.00	15	1
28	1	12.00	15	8
29	1	11.00	15	15
\.


--
-- Data for Name: claims; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.claims (id, admin_id, buyer_id, detail_id) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.messages (id, content, send_at, claim_id, sender_id) FROM stdin;
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.password_reset_tokens (id, created_at, expiration_date, token_hash, used, user_id) FROM stdin;
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.product_images (id, url, product_id) FROM stdin;
1	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606102/pawify/ahfopdzrw62aq8ww3vbk.webp	1
2	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606104/pawify/gxixd0n9ulrejqjknoqz.webp	1
3	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606105/pawify/i796vpjkkvgkuk6h0qo8.jpg	1
4	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606106/pawify/rcggjo7rnbr8jo7bg25o.webp	2
5	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606107/pawify/ole4tf4csndmo8qyczor.jpg	2
6	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606108/pawify/bwhov7rltbofl4n8fqjb.webp	2
7	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606110/pawify/ojqrjp0bg6bgncz8ohfr.webp	3
8	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606111/pawify/nd5l8w42lgxgdtjh8aut.webp	3
9	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606112/pawify/nibvttwhzd4bjycrjiou.webp	3
10	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606113/pawify/wtjtzelg5ncrdgmviryz.webp	4
11	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606114/pawify/skanc7sfqk5th60cq6d3.webp	4
12	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606115/pawify/z2yxtogeavpzpa334amc.webp	4
13	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606117/pawify/bzn9wqcjghuhrkovc1li.webp	5
14	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606118/pawify/mqhjjuxqcul8xchlnlzl.webp	5
15	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606120/pawify/lxd7urueaex4fnanotla.jpg	5
16	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606122/pawify/bnip8awlroffaviurbzw.webp	6
17	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606123/pawify/b1qbkwosclbqjwg69odu.webp	6
18	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606124/pawify/h0ebxodoabqxhkfkzajx.webp	6
19	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606125/pawify/rt9lmyatkcp5ugprvzzo.webp	7
20	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606126/pawify/bva67lwlkefmjcjbh2w7.webp	7
21	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606127/pawify/jbiisjmlieiigssner2y.webp	7
22	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606129/pawify/kujytohqovsotpusjxwt.png	8
23	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606130/pawify/pqepoerliqvhtb2ft8a3.webp	8
24	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606131/pawify/edg1jjk4xfsygihj4guk.webp	8
25	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606132/pawify/spidynjpbve74cvgj5mg.webp	9
26	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606133/pawify/aunn3gttabia5cgvmo4c.webp	9
27	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606135/pawify/lhhairn4inv2igmysll6.jpg	9
28	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606136/pawify/dzr7owrirg5yoodskvhm.webp	10
29	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606137/pawify/lc1ioeiibt9rupaktvip.webp	10
30	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606139/pawify/dvbqgtyflaj7gyu8swjd.webp	10
31	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606140/pawify/f77zevxwlw1hp8mlmfkm.webp	11
32	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606141/pawify/swfpqlfocrl1t4dm3rsc.webp	11
33	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606143/pawify/bv8d4knfs6fcoexyabvm.png	11
34	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606144/pawify/l1zgnsyubwl3gtn8vvda.webp	12
35	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606145/pawify/tnk779i8kocqrwr8l4pv.jpg	12
36	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606147/pawify/gduz9xkyhuqmbzwz3h8y.jpg	12
37	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606148/pawify/wc2zrelmvs0wa9oj82kd.webp	13
38	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606149/pawify/oiqyyou9ggebieunyt7h.webp	13
39	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606151/pawify/aezcom6c4wb6vvbbxu89.jpg	13
40	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606152/pawify/radvjmdythkayspfkkz0.webp	14
41	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606153/pawify/wvfxjzvi0uplmrxp3zfu.webp	14
42	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606155/pawify/dq0ay2wapf8nl2vlqex1.jpg	14
43	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606156/pawify/tpaf1vqq7dtuurj0wxxw.webp	15
44	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606157/pawify/nyaceyfvtf770cwfxxqj.webp	15
45	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606159/pawify/lhludwiuzyzinpxduqxs.jpg	15
46	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606160/pawify/xqmla4ynkrocefwyz2t4.webp	16
47	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606161/pawify/ji0ecrkmzzrkfs7pbrlh.webp	16
48	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606162/pawify/qn4lhv86m8tjmcoufhya.jpg	16
49	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606163/pawify/tp9ekc00udwranll3yyk.webp	17
50	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606165/pawify/gg0aar3vfvylv8c8ousj.jpg	17
51	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606166/pawify/ynv18fwkt1c0ecezfout.webp	17
52	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606167/pawify/dnmw6zdqaano3ya5wein.jpg	18
53	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606168/pawify/hjtciyhzwp3a1xhkhqkt.jpg	18
54	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606169/pawify/mdhchohstnfyyfqzai0w.webp	18
55	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606170/pawify/lhwzcfvdvoi42bwbsbjd.webp	19
56	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606171/pawify/xyo2fsewwtarkincxo0o.webp	19
57	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606173/pawify/j8ulq3qqwayror7twav9.webp	19
58	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606174/pawify/imlztjftbjmsfiqxbvvc.webp	20
59	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606175/pawify/j9vgg2lt4gadepvbv93i.webp	20
60	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606176/pawify/o2lfd2bfzjhv9xdxzz8e.webp	20
61	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606178/pawify/ljll9heoga1np1jeotbp.webp	21
62	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606179/pawify/m3knma5esckgox45jozd.webp	21
63	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606181/pawify/mzaqrhanq3aynzu1aols.webp	21
64	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606182/pawify/vxzvtlt4yltroah66gsd.webp	22
65	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606183/pawify/y78rxk01lavialovi8in.webp	22
66	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606185/pawify/kbmmfchsr1ymhqnk0fad.webp	22
67	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606186/pawify/parrfvo8ywtnuod5fye8.png	23
68	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606188/pawify/gmcxqg7v6jzmqru8c9zg.webp	23
69	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606190/pawify/wxqiupqpbirlb2edpy1v.webp	23
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.reviews (id, content, created_at, rating, buyer_id, detail_id, product_id) FROM stdin;
1	La calidad es excelente	2026-05-12 12:16:33.531118	5	17	1	22
2	Buen producto	2026-05-12 12:16:35.317324	5	18	2	5
3	Llegó rápido y en buen estado	2026-05-12 12:16:35.332748	5	18	3	21
4	No era exactamente como esperaba	2026-05-12 12:16:36.779564	3	19	4	1
5	Cumple con lo prometido	2026-05-12 12:16:36.814747	4	19	5	8
6	La calidad es excelente	2026-05-12 12:16:38.133503	5	20	6	17
7	Cumple con lo prometido	2026-05-12 12:16:38.16896	4	20	7	12
8	Muy mala experiencia	2026-05-12 12:16:39.74719	1	21	8	2
9	Cumple con lo prometido	2026-05-12 12:16:40.874122	4	21	9	10
10	El producto dejó de funcionar al poco tiempo	2026-05-12 12:16:42.410009	2	22	10	1
11	Llegó rápido y en buen estado	2026-05-12 12:16:42.448923	5	22	11	9
12	Cumple con lo prometido	2026-05-12 12:16:43.745261	4	23	12	8
13	Cumple con lo prometido	2026-05-12 12:16:45.162817	4	23	13	10
14	No era exactamente como esperaba	2026-05-12 12:16:47.001707	3	24	14	18
15	Relación calidad-precio aceptable	2026-05-12 12:16:48.553821	4	25	15	1
16	La calidad es excelente	2026-05-12 12:16:49.88543	5	26	16	7
17	No era exactamente como esperaba	2026-05-12 12:16:51.115536	3	26	17	10
18	Muy mala experiencia	2026-05-12 12:16:52.4465	1	27	18	11
19	Cumple con lo prometido	2026-05-12 12:16:52.478034	4	27	19	15
20	Llegó rápido y en buen estado	2026-05-12 12:16:52.507125	5	28	20	17
21	Cumple con lo prometido	2026-05-12 12:16:52.537196	4	28	21	11
22	Buen producto	2026-05-12 12:16:53.674311	5	28	22	15
23	Muy mala experiencia	2026-05-12 12:16:54.698797	1	29	23	18
24	Buen producto	2026-05-12 12:16:55.722409	5	29	24	5
25	El producto dejó de funcionar al poco tiempo	2026-05-12 12:16:57.35993	2	30	25	6
26	Llegó rápido y en buen estado	2026-05-12 12:16:58.487111	5	30	26	9
27	El producto dejó de funcionar al poco tiempo	2026-05-12 12:16:58.520009	2	31	27	1
28	Llegó rápido y en buen estado	2026-05-12 12:16:58.547117	5	31	28	8
29	Muy mala experiencia	2026-05-12 12:17:00.741415	1	31	29	15
\.


--
-- Data for Name: review_images; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.review_images (id, url, review_id) FROM stdin;
1	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606194/pawify/cafapbxk0s2biqylqoh9.jpg	2
2	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606196/pawify/hvhxbv2uppz73kw7i35a.jpg	4
3	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606197/pawify/u6orisbtdvlhvz4h3mi5.jpg	6
4	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606199/pawify/wftjdiir1qdchyzkkqus.jpg	8
5	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606200/pawify/d5pnjqh0rjvhq1k7ivrh.webp	9
6	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606201/pawify/qprmf2nbvqewflb4c1t2.jpg	10
7	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606203/pawify/brh6uxao2esxsevbpka5.jpg	12
8	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606204/pawify/ngz29tlt6mdlhpn82fql.jpg	13
9	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606205/pawify/xkokagflkipvpgcdqt1j.jpg	14
10	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606207/pawify/iyplp9lwlisuegphvf4y.jpg	15
11	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606209/pawify/ndadwbblf7w9phvehthq.jpg	16
12	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606210/pawify/nfbiomvxikchsuebnfnz.webp	17
13	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606211/pawify/msadpvzg5c2pa4nj8tgs.jpg	18
14	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606213/pawify/yxxxxjgpojzuwped1t3g.webp	22
15	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606214/pawify/cefhus4vdiopj1jjxevm.webp	23
16	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606215/pawify/smnifnqrhxitw2uaosrc.webp	24
17	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606216/pawify/dr7cdoitalrjdjwnazcn.jpg	25
18	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606218/pawify/gqcseydeill669ondhbk.jpg	26
19	https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606219/pawify/rwofpdrmjd9z9jepzsbm.jpg	29
\.


--
-- Data for Name: tracking_statuses; Type: TABLE DATA; Schema: public; Owner: dbuser
--

COPY public.tracking_statuses (id, description, "timestamp", title, order_id) FROM stdin;
1	El sistema procesó la compra correctamente.	2026-05-12 12:17:00.77586	Compra procesada	1
2	El vendedor está organizando el pedido.	2026-05-12 12:17:00.806269	Preparando envío	1
3	El paquete fue enviado hacia el destino.	2026-05-12 12:17:00.826578	Enviado	1
4	No se pudo concretar la entrega en el primer intento.	2026-05-12 12:17:00.846392	Intento de entrega	1
5	La entrega fue reprogramada para otro día.	2026-05-12 12:17:00.865514	Reprogramado	1
6	El vendedor confirmó el pedido.	2026-05-12 12:17:00.88517	Pedido confirmado	2
7	Los productos fueron empaquetados.	2026-05-12 12:17:00.906717	Empaque completado	2
8	El paquete se dirige a la ciudad de destino.	2026-05-12 12:17:00.92812	En tránsito	2
9	La entrega fue cancelada por solicitud del cliente.	2026-05-12 12:17:00.946841	Entrega cancelada	2
10	El proceso de devolución del dinero comenzó.	2026-05-12 12:17:00.965938	Reembolso iniciado	2
11	La orden fue aceptada exitosamente.	2026-05-12 12:17:00.98607	Orden confirmada	3
12	Uno de los productos no tiene stock disponible.	2026-05-12 12:17:01.002955	Producto agotado	3
13	El almacén está reponiendo el inventario faltante.	2026-05-12 12:17:01.017465	Reposición en proceso	3
14	El pedido volvió a preparación.	2026-05-12 12:17:01.039866	Preparando pedido	3
15	La orden fue aceptada exitosamente.	2026-05-12 12:17:01.060743	Orden confirmada	4
16	Uno de los productos no tiene stock disponible.	2026-05-12 12:17:01.082067	Producto agotado	4
17	El almacén está reponiendo el inventario faltante.	2026-05-12 12:17:01.102952	Reposición en proceso	4
18	El pedido volvió a preparación.	2026-05-12 12:17:01.121039	Preparando pedido	4
19	La orden fue recibida por el sistema.	2026-05-12 12:17:01.140534	Pedido recibido	5
20	El pedido quedó listo para ser enviado.	2026-05-12 12:17:01.161004	Listo para despacho	5
21	La empresa transportista recogió el paquete.	2026-05-12 12:17:01.18359	Recogido por courier	5
22	El paquete llegó al centro logístico regional.	2026-05-12 12:17:01.203089	Centro de distribución	5
23	La entrega se completó exitosamente.	2026-05-12 12:17:01.221895	Entregado	5
24	La compra fue registrada exitosamente.	2026-05-12 12:17:01.241782	Pedido confirmado	6
25	Los productos están siendo preparados para envío.	2026-05-12 12:17:01.263306	Preparando pedido	6
26	El paquete salió del almacén principal.	2026-05-12 12:17:01.284925	Enviado	6
27	El pedido se encuentra camino al destino.	2026-05-12 12:17:01.304543	En tránsito	6
28	El cliente recibió el pedido correctamente.	2026-05-12 12:17:01.323243	Entregado	6
29	La orden fue aceptada exitosamente.	2026-05-12 12:17:01.342834	Orden confirmada	7
30	Uno de los productos no tiene stock disponible.	2026-05-12 12:17:01.362199	Producto agotado	7
31	El almacén está reponiendo el inventario faltante.	2026-05-12 12:17:01.382726	Reposición en proceso	7
32	El pedido volvió a preparación.	2026-05-12 12:17:01.399945	Preparando pedido	7
33	El sistema procesó la compra correctamente.	2026-05-12 12:17:01.415809	Compra procesada	8
34	El vendedor está organizando el pedido.	2026-05-12 12:17:01.437781	Preparando envío	8
35	El paquete fue enviado hacia el destino.	2026-05-12 12:17:01.456316	Enviado	8
36	No se pudo concretar la entrega en el primer intento.	2026-05-12 12:17:01.472207	Intento de entrega	8
37	La entrega fue reprogramada para otro día.	2026-05-12 12:17:01.488205	Reprogramado	8
38	El pago fue validado por la plataforma.	2026-05-12 12:17:01.504748	Pago aprobado	9
39	El paquete fue embalado correctamente.	2026-05-12 12:17:01.525305	Empaque completado	9
40	El envío presenta demoras por alta demanda.	2026-05-12 12:17:01.545547	Retraso logístico	9
41	El paquete continúa su recorrido.	2026-05-12 12:17:01.567778	En tránsito	9
42	La orden fue recibida por el sistema.	2026-05-12 12:17:01.587598	Pedido recibido	10
43	El pedido quedó listo para ser enviado.	2026-05-12 12:17:01.606378	Listo para despacho	10
44	La empresa transportista recogió el paquete.	2026-05-12 12:17:01.624979	Recogido por courier	10
45	El paquete llegó al centro logístico regional.	2026-05-12 12:17:01.643465	Centro de distribución	10
46	La entrega se completó exitosamente.	2026-05-12 12:17:01.662512	Entregado	10
47	La orden fue aceptada exitosamente.	2026-05-12 12:17:01.679835	Orden confirmada	11
48	Uno de los productos no tiene stock disponible.	2026-05-12 12:17:01.699197	Producto agotado	11
49	El almacén está reponiendo el inventario faltante.	2026-05-12 12:17:01.720158	Reposición en proceso	11
50	El pedido volvió a preparación.	2026-05-12 12:17:01.738402	Preparando pedido	11
51	El vendedor confirmó el pedido.	2026-05-12 12:17:01.75731	Pedido confirmado	12
52	Los productos fueron empaquetados.	2026-05-12 12:17:01.779669	Empaque completado	12
53	El paquete se dirige a la ciudad de destino.	2026-05-12 12:17:01.80142	En tránsito	12
54	La entrega fue cancelada por solicitud del cliente.	2026-05-12 12:17:01.819594	Entrega cancelada	12
55	El proceso de devolución del dinero comenzó.	2026-05-12 12:17:01.836617	Reembolso iniciado	12
56	La orden fue recibida por el sistema.	2026-05-12 12:17:01.855246	Pedido recibido	13
57	El pedido quedó listo para ser enviado.	2026-05-12 12:17:01.876373	Listo para despacho	13
58	La empresa transportista recogió el paquete.	2026-05-12 12:17:01.894733	Recogido por courier	13
59	El paquete llegó al centro logístico regional.	2026-05-12 12:17:01.911116	Centro de distribución	13
60	La entrega se completó exitosamente.	2026-05-12 12:17:01.92694	Entregado	13
61	La orden fue recibida por el sistema.	2026-05-12 12:17:01.945721	Pedido recibido	14
62	El pedido quedó listo para ser enviado.	2026-05-12 12:17:01.963348	Listo para despacho	14
63	La empresa transportista recogió el paquete.	2026-05-12 12:17:01.982625	Recogido por courier	14
64	El paquete llegó al centro logístico regional.	2026-05-12 12:17:02.002385	Centro de distribución	14
65	La entrega se completó exitosamente.	2026-05-12 12:17:02.02125	Entregado	14
66	La orden fue aceptada exitosamente.	2026-05-12 12:17:02.038844	Orden confirmada	15
67	Uno de los productos no tiene stock disponible.	2026-05-12 12:17:02.058327	Producto agotado	15
68	El almacén está reponiendo el inventario faltante.	2026-05-12 12:17:02.079784	Reposición en proceso	15
69	El pedido volvió a preparación.	2026-05-12 12:17:02.09904	Preparando pedido	15
\.


--
-- Name: addresses_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.addresses_seq', 1, false);


--
-- Name: brands_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.brands_seq', 51, true);


--
-- Name: buyer_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.buyer_images_id_seq', 1, false);


--
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.cards_id_seq', 1, false);


--
-- Name: categories_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.categories_seq', 51, true);


--
-- Name: claims_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.claims_id_seq', 1, false);


--
-- Name: details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.details_id_seq', 29, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.orders_id_seq', 15, true);


--
-- Name: password_reset_tokens_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.password_reset_tokens_seq', 1, false);


--
-- Name: product_images_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.product_images_seq', 101, true);


--
-- Name: products_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.products_seq', 51, true);


--
-- Name: review_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.review_images_id_seq', 19, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.reviews_id_seq', 29, true);


--
-- Name: roles_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.roles_seq', 51, true);


--
-- Name: sub_categories_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.sub_categories_seq', 51, true);


--
-- Name: tracking_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.tracking_statuses_id_seq', 69, true);


--
-- Name: users_seq; Type: SEQUENCE SET; Schema: public; Owner: dbuser
--

SELECT pg_catalog.setval('public.users_seq', 51, true);


--
-- PostgreSQL database dump complete
--

\unrestrict C72PZu7Me2bCbyllwoQZz6DaYIvxRjRvXjTcrr8JXOqP2zL1QBKov6vlSpKy1Y7

