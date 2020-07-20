--
-- PostgreSQL database dump
--

-- Dumped from database version 10.13
-- Dumped by pg_dump version 10.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
--
-- Name: enum_Users_country; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_country" AS ENUM (
    'AF',
    'AX',
    'AL',
    'DZ',
    'AS',
    'AD',
    'AO',
    'AI',
    'AQ',
    'AG',
    'AR',
    'AM',
    'AW',
    'AU',
    'AT',
    'AZ',
    'BS',
    'BH',
    'BD',
    'BB',
    'BY',
    'BE',
    'BZ',
    'BJ',
    'BM',
    'BT',
    'BO',
    'BQ',
    'BA',
    'BW',
    'BV',
    'BR',
    'IO',
    'BN',
    'BG',
    'BF',
    'BI',
    'CV',
    'KH',
    'CM',
    'CA',
    'KY',
    'CF',
    'TD',
    'CL',
    'CN',
    'CX',
    'CC',
    'CO',
    'KM',
    'CG',
    'CD',
    'CK',
    'CR',
    'CI',
    'HR',
    'CU',
    'CW',
    'CY',
    'CZ',
    'DK',
    'DJ',
    'DM',
    'DO',
    'EC',
    'EG',
    'SV',
    'GQ',
    'ER',
    'EE',
    'SZ',
    'ET',
    'FK',
    'FO',
    'FJ',
    'FI',
    'FR',
    'GF',
    'PF',
    'TF',
    'GA',
    'GM',
    'GE',
    'DE',
    'GH',
    'GI',
    'GR',
    'GL',
    'GD',
    'GP',
    'GU',
    'GT',
    'GG',
    'GN',
    'GW',
    'GY',
    'HT',
    'HM',
    'VA',
    'HN',
    'HK',
    'HU',
    'IS',
    'IN',
    'ID',
    'IR',
    'IQ',
    'IE',
    'IM',
    'IL',
    'IT',
    'JM',
    'JP',
    'JE',
    'JO',
    'KZ',
    'KE',
    'KI',
    'KP',
    'KR',
    'KW',
    'KG',
    'LA',
    'LV',
    'LB',
    'LS',
    'LR',
    'LY',
    'LI',
    'LT',
    'LU',
    'MO',
    'MG',
    'MW',
    'MY',
    'MV',
    'ML',
    'MT',
    'MH',
    'MQ',
    'MR',
    'MU',
    'YT',
    'MX',
    'FM',
    'MD',
    'MC',
    'MN',
    'ME',
    'MS',
    'MA',
    'MZ',
    'MM',
    'NA',
    'NR',
    'NP',
    'NL',
    'NC',
    'NZ',
    'NI',
    'NE',
    'NG',
    'NU',
    'NF',
    'MK',
    'MP',
    'NO',
    'OM',
    'PK',
    'PW',
    'PS',
    'PA',
    'PG',
    'PY',
    'PE',
    'PH',
    'PN',
    'PL',
    'PT',
    'PR',
    'QA',
    'RE',
    'RO',
    'RU',
    'RW',
    'BL',
    'SH',
    'KN',
    'LC',
    'MF',
    'PM',
    'VC',
    'WS',
    'SM',
    'ST',
    'SA',
    'SN',
    'RS',
    'SC',
    'SL',
    'SG',
    'SX',
    'SK',
    'SI',
    'SB',
    'SO',
    'ZA',
    'GS',
    'SS',
    'ES',
    'LK',
    'SD',
    'SR',
    'SJ',
    'SE',
    'CH',
    'SY',
    'TW',
    'TJ',
    'TZ',
    'TH',
    'TL',
    'TG',
    'TK',
    'TO',
    'TT',
    'TN',
    'TR',
    'TM',
    'TC',
    'TV',
    'UG',
    'UA',
    'AE',
    'GB',
    'US',
    'UM',
    'UY',
    'UZ',
    'VU',
    'VE',
    'VN',
    'VG',
    'VI',
    'WF',
    'EH',
    'YE',
    'ZM',
    'ZW'
);


ALTER TYPE public."enum_Users_country" OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: BinaryExtractions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BinaryExtractions" (
    id integer NOT NULL,
    extension character varying(255) NOT NULL,
    size integer NOT NULL,
    "extractionMs" integer NOT NULL,
    "wordlistId" integer
);


ALTER TABLE public."BinaryExtractions" OWNER TO postgres;

--
-- Name: BinaryExtractions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BinaryExtractions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."BinaryExtractions_id_seq" OWNER TO postgres;

--
-- Name: BinaryExtractions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BinaryExtractions_id_seq" OWNED BY public."BinaryExtractions".id;


--
-- Name: Images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Images" (
    id integer NOT NULL,
    url character varying(255) NOT NULL,
    description text,
    "createdAt" timestamp with time zone NOT NULL,
    "wordId" integer
);


ALTER TABLE public."Images" OWNER TO postgres;

--
-- Name: Images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Images_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Images_id_seq" OWNER TO postgres;

--
-- Name: Images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Images_id_seq" OWNED BY public."Images".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "encryptedPassword" character varying(255) NOT NULL,
    country public."enum_Users_country" NOT NULL,
    email character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Wordlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wordlists" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "isPrivate" boolean NOT NULL,
    description text,
    language character varying(255) NOT NULL,
    "avatarColor" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "ownerId" integer NOT NULL
);


ALTER TABLE public."Wordlists" OWNER TO postgres;

--
-- Name: Wordlists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Wordlists_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Wordlists_id_seq" OWNER TO postgres;

--
-- Name: Wordlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Wordlists_id_seq" OWNED BY public."Wordlists".id;


--
-- Name: Words; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Words" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "wordlistId" integer
);


ALTER TABLE public."Words" OWNER TO postgres;

--
-- Name: Words_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Words_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Words_id_seq" OWNER TO postgres;

--
-- Name: Words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Words_id_seq" OWNED BY public."Words".id;


--
-- Name: YoutubeSubtitles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."YoutubeSubtitles" (
    id integer NOT NULL,
    "videoId" character varying(255) NOT NULL,
    "languageCode" character varying(255) NOT NULL,
    "languageName" character varying(255) NOT NULL,
    "isAutomatic" boolean NOT NULL,
    "downloadUrl" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."YoutubeSubtitles" OWNER TO postgres;

--
-- Name: YoutubeSubtitles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."YoutubeSubtitles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."YoutubeSubtitles_id_seq" OWNER TO postgres;

--
-- Name: YoutubeSubtitles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."YoutubeSubtitles_id_seq" OWNED BY public."YoutubeSubtitles".id;


--
-- Name: BinaryExtractions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BinaryExtractions" ALTER COLUMN id SET DEFAULT nextval('public."BinaryExtractions_id_seq"'::regclass);


--
-- Name: Images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Images" ALTER COLUMN id SET DEFAULT nextval('public."Images_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: Wordlists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wordlists" ALTER COLUMN id SET DEFAULT nextval('public."Wordlists_id_seq"'::regclass);


--
-- Name: Words id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Words" ALTER COLUMN id SET DEFAULT nextval('public."Words_id_seq"'::regclass);


--
-- Name: YoutubeSubtitles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."YoutubeSubtitles" ALTER COLUMN id SET DEFAULT nextval('public."YoutubeSubtitles_id_seq"'::regclass);


--
-- Name: BinaryExtractions BinaryExtractions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BinaryExtractions"
    ADD CONSTRAINT "BinaryExtractions_pkey" PRIMARY KEY (id);


--
-- Name: Images Images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Images"
    ADD CONSTRAINT "Images_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Wordlists Wordlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wordlists"
    ADD CONSTRAINT "Wordlists_pkey" PRIMARY KEY (id);


--
-- Name: Words Words_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Words"
    ADD CONSTRAINT "Words_pkey" PRIMARY KEY (id);


--
-- Name: YoutubeSubtitles YoutubeSubtitles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."YoutubeSubtitles"
    ADD CONSTRAINT "YoutubeSubtitles_pkey" PRIMARY KEY (id);


--
-- Name: wordlists_owner_id_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX wordlists_owner_id_id ON public."Wordlists" USING btree ("ownerId", id);


--
-- Name: youtube_subtitles_video_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX youtube_subtitles_video_id ON public."YoutubeSubtitles" USING btree ("videoId");


--
-- Name: BinaryExtractions BinaryExtractions_wordlistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BinaryExtractions"
    ADD CONSTRAINT "BinaryExtractions_wordlistId_fkey" FOREIGN KEY ("wordlistId") REFERENCES public."Wordlists"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Images Images_wordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Images"
    ADD CONSTRAINT "Images_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES public."Words"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Wordlists Wordlists_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wordlists"
    ADD CONSTRAINT "Wordlists_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Words Words_wordlistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Words"
    ADD CONSTRAINT "Words_wordlistId_fkey" FOREIGN KEY ("wordlistId") REFERENCES public."Wordlists"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

