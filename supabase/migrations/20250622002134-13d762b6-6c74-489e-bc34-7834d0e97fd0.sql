
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'property_owner');

-- Create enum for property types
CREATE TYPE public.property_type AS ENUM ('house', 'apartment', 'studio', 'shared_room');

-- Create enum for property status
CREATE TYPE public.property_status AS ENUM ('available', 'rented', 'pending');

-- Create enum for inquiry status
CREATE TYPE public.inquiry_status AS ENUM ('pending', 'responded', 'closed');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    rent DECIMAL(10,2) NOT NULL,
    location TEXT NOT NULL,
    bedrooms INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    property_type property_type NOT NULL,
    status property_status NOT NULL DEFAULT 'available',
    amenities TEXT[] DEFAULT '{}',
    available_from DATE NOT NULL,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inquiries table for student-owner communication
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status inquiry_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inquiry_messages table for conversation threads
CREATE TABLE public.inquiry_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for properties
CREATE POLICY "Anyone can view available properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Property owners can insert own properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Property owners can update own properties" ON public.properties FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Property owners can delete own properties" ON public.properties FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for inquiries
CREATE POLICY "Users can view own inquiries" ON public.inquiries FOR SELECT USING (auth.uid() = student_id OR auth.uid() = owner_id);
CREATE POLICY "Students can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Property owners can update inquiry status" ON public.inquiries FOR UPDATE USING (auth.uid() = owner_id);

-- RLS Policies for inquiry messages
CREATE POLICY "Users can view messages in their inquiries" ON public.inquiry_messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.inquiries 
        WHERE inquiries.id = inquiry_messages.inquiry_id 
        AND (inquiries.student_id = auth.uid() OR inquiries.owner_id = auth.uid())
    )
);
CREATE POLICY "Users can send messages in their inquiries" ON public.inquiry_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.inquiries 
        WHERE inquiries.id = inquiry_messages.inquiry_id 
        AND (inquiries.student_id = auth.uid() OR inquiries.owner_id = auth.uid())
    )
);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_properties BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_inquiries BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
        COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
        COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
